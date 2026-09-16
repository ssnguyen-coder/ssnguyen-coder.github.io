import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MapleItem, MAPLE_DROPPABLE_ITEMS } from '../data/mapleItems';
import { bgmPlayer } from '../utils/audioSynth';
import { MapleLeafIcon, MushroomCapIcon } from './MapleIcons';
import {
  Volume2,
  VolumeX,
  Sparkles,
  Sword,
  Backpack,
  FileText,
  MessageCircle,
  HelpCircle,
  Linkedin,
  Github,
  Mail,
  Copy,
  Check,
  X,
  ArrowUp,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';

interface Platform {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  label?: string;
}

interface Monster {
  id: string;
  name: string;
  type: 'mushroom' | 'slime' | 'pig' | 'snail';
  x: number;
  y: number;
  platformId: string;
  vx: number;
  maxHp: number;
  currentHp: number;
  isAlive: boolean;
  dropItemId: string;
  respawnTimer?: number;
  hurtCooldown: number;
}

interface DroppedItemInstance {
  id: string;
  item: MapleItem;
  x: number;
  y: number;
  vy: number;
  groundY: number;
  bounces: number;
  sparkleTime: number;
}

interface ArrowProjectile {
  id: string;
  x: number;
  y: number;
  vx: number;
  facing: 'left' | 'right';
  life: number;
}

interface DamageNumber {
  id: string;
  value: number;
  isCritical: boolean;
  x: number;
  y: number;
  opacity: number;
}

interface MapleGameStageProps {
  onOpenInventory: () => void;
  onOpenResume: () => void;
  inventory: MapleItem[];
  onAddItem: (item: MapleItem) => void;
  onSelectItemForModal: (item: MapleItem) => void;
}

export const MapleGameStage: React.FC<MapleGameStageProps> = ({
  onOpenInventory,
  onOpenResume,
  inventory,
  onAddItem,
  onSelectItemForModal,
}) => {
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  // Game coordinates virtual canvas resolution: 960 x 540
  const V_WIDTH = 960;
  const V_HEIGHT = 540;

  // Audio BGM state
  const [isPlayingBgm, setIsPlayingBgm] = useState(false);
  // Whisper / Contact Modal state
  const [isWhisperOpen, setIsWhisperOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Platforms matching the Henesys map image
  const platforms: Platform[] = [
    // Bottom ground floor
    { id: 'ground', x: 0, y: 470, w: 960, h: 70, label: 'Henesys Hunting Field' },
    // Middle main shelf platform with haybale and flowers
    { id: 'middle-shelf', x: 190, y: 310, w: 770, h: 42, label: 'Middle Meadow' },
    // Top elevated shelf platform
    { id: 'top-shelf', x: 260, y: 155, w: 700, h: 38, label: 'Sunflower Ridge' },
    // Left staggered floating platforms
    { id: 'left-top', x: 190, y: 65, w: 110, h: 26 },
    { id: 'left-mid-1', x: 120, y: 195, w: 115, h: 26 },
    { id: 'left-mid-2', x: 120, y: 250, w: 115, h: 26 },
    { id: 'left-bot-1', x: 55, y: 360, w: 115, h: 26 },
    { id: 'left-bot-2', x: 55, y: 415, w: 115, h: 26 },
  ];

  // Character State (Dropping in on spawn as requested)
  const [player, setPlayer] = useState({
    x: 420,
    y: 40, // Drops from top!
    vx: 0,
    vy: 0,
    isGrounded: false,
    facing: 'right' as 'left' | 'right',
    isAttacking: false,
    attackTimer: 0,
    hasLandedOnce: false,
  });

  // Monsters roaming platforms - user requested Orange Mushroom, Green Slime, Blue Snail
  const [monsters, setMonsters] = useState<Monster[]>([
    {
      id: 'm-orange-shroom',
      name: 'Orange Mushroom',
      type: 'mushroom',
      x: 520,
      y: 280,
      platformId: 'middle-shelf',
      vx: 1.1,
      maxHp: 200,
      currentHp: 200,
      isAlive: true,
      dropItemId: 'credit-risk-scroll',
      hurtCooldown: 0,
    },
    {
      id: 'm-slime-1',
      name: 'Green Slime',
      type: 'slime',
      x: 680,
      y: 440,
      platformId: 'ground',
      vx: -1.0,
      maxHp: 150,
      currentHp: 150,
      isAlive: true,
      dropItemId: 'spring-boot-helm',
      hurtCooldown: 0,
    },
    {
      id: 'm-snail-1',
      name: 'Blue Snail',
      type: 'snail',
      x: 300,
      y: 446,
      platformId: 'ground',
      vx: 0.6,
      maxHp: 100,
      currentHp: 100,
      isAlive: true,
      dropItemId: 'shelter-movers-medal',
      hurtCooldown: 0,
    },
  ]);

  // Arrow projectiles shot by Archer
  const [arrows, setArrows] = useState<ArrowProjectile[]>([]);

  // Dropped items on the field
  const [droppedItems, setDroppedItems] = useState<DroppedItemInstance[]>([]);
  // Floating Damage Numbers
  const [damageNumbers, setDamageNumbers] = useState<DamageNumber[]>([]);
  // Toast notifications for items obtained
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Key states
  const keysPressed = useRef<{ [key: string]: boolean }>({});

  // Sync BGM playing state
  useEffect(() => {
    bgmPlayer.subscribe((playing) => {
      setIsPlayingBgm(playing);
    });
  }, []);

  const handleToggleBgm = () => {
    bgmPlayer.toggle();
  };

  // Virtual key controls for on-screen touch/mouse buttons
  const setVirtualKey = (key: string, pressed: boolean) => {
    keysPressed.current[key.toLowerCase()] = pressed;
  };

  // Trigger attack action (Archer Bow Attack)
  const performAttack = useCallback(() => {
    bgmPlayer.playBowShoot();

    setPlayer((prev) => ({
      ...prev,
      isAttacking: true,
      attackTimer: 16, // frames of attack animation
    }));

    // Shoot arrow projectile forward from Archer's bow
    const arrowStartX = player.facing === 'right' ? player.x + 38 : player.x - 10;
    const arrowStartY = player.y + 24;
    const arrowVx = player.facing === 'right' ? 12 : -12;

    const newArrow: ArrowProjectile = {
      id: `arrow-${Date.now()}-${Math.random()}`,
      x: arrowStartX,
      y: arrowStartY,
      vx: arrowVx,
      facing: player.facing,
      life: 30, // frames to travel
    };

    setArrows((prev) => [...prev, newArrow]);

    // Check immediate hit radius in front of character as well (close-to-mid range)
    const hitBoxX = player.facing === 'right' ? player.x + 10 : player.x - 180;
    const hitBoxW = 200;
    const hitBoxY = player.y - 15;
    const hitBoxH = 65;

    setMonsters((prevMonsters) =>
      prevMonsters.map((m) => {
        if (!m.isAlive) return m;

        // Collision check with monster
        const mBox = { x: m.x, y: m.y, w: 46, h: 46 };
        const isHit =
          hitBoxX < mBox.x + mBox.w &&
          hitBoxX + hitBoxW > mBox.x &&
          hitBoxY < mBox.y + mBox.h &&
          hitBoxY + hitBoxH > mBox.y;

        if (isHit) {
          const isCrit = Math.random() > 0.4;
          const damage = isCrit ? Math.floor(8000 + Math.random() * 4500) : Math.floor(4500 + Math.random() * 3000);
          bgmPlayer.playHitSound(isCrit);

          // Add floating damage number
          setDamageNumbers((prevDmg) => [
            ...prevDmg,
            {
              id: `${Date.now()}-${Math.random()}`,
              value: damage,
              isCritical: isCrit,
              x: m.x + 15,
              y: m.y - 15,
              opacity: 1,
            },
          ]);

          const nextHp = Math.max(0, m.currentHp - damage);

          if (nextHp === 0) {
            // Monster defeated!
            bgmPlayer.playMonsterDefeat();

            // Find drop item definition
            const itemToDrop =
              MAPLE_DROPPABLE_ITEMS.find((item) => item.id === m.dropItemId) ||
              MAPLE_DROPPABLE_ITEMS[Math.floor(Math.random() * MAPLE_DROPPABLE_ITEMS.length)];

            // Drop item with arc physics
            setTimeout(() => {
              bgmPlayer.playItemDrop();
              setDroppedItems((prev) => [
                ...prev,
                {
                  id: `drop-${Date.now()}-${Math.random()}`,
                  item: itemToDrop,
                  x: m.x + 8,
                  y: m.y + 10,
                  vy: -6, // jump up
                  groundY: m.y + 20,
                  bounces: 0,
                  sparkleTime: 0,
                },
              ]);
            }, 80);

            // Schedule respawn after 5 seconds
            setTimeout(() => {
              setMonsters((curr) =>
                curr.map((mon) =>
                  mon.id === m.id
                    ? {
                        ...mon,
                        isAlive: true,
                        currentHp: mon.maxHp,
                        x: mon.platformId === 'middle-shelf' ? 520 : mon.id === 'm-slime-1' ? 680 : 300,
                      }
                    : mon
                )
              );
            }, 5000);

            return {
              ...m,
              currentHp: 0,
              isAlive: false,
            };
          }

          return {
            ...m,
            currentHp: nextHp,
            vx: player.facing === 'right' ? 2.5 : -2.5, // knockback
          };
        }

        return m;
      })
    );
  }, [player.facing, player.x, player.y]);

  // Pick up an item
  const pickupItem = useCallback(
    (itemInstance: DroppedItemInstance) => {
      bgmPlayer.playItemPickup();
      onAddItem(itemInstance.item);
      setDroppedItems((prev) => prev.filter((d) => d.id !== itemInstance.id));

      setToastMessage(`✨ Obtained [${itemInstance.item.name}]! Press [I] to inspect in Inventory`);
      setTimeout(() => setToastMessage(null), 4000);
    },
    [onAddItem]
  );

  // Jump action
  const performJump = useCallback(() => {
    if (player.isGrounded) {
      bgmPlayer.playJumpSound();
      setPlayer((prev) => ({
        ...prev,
        vy: -11.5,
        isGrounded: false,
      }));
    }
  }, [player.isGrounded]);

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid hijacking if user is typing
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      keysPressed.current[e.key.toLowerCase()] = true;

      // Attack
      if (e.key.toLowerCase() === 'x' || e.key === 'Control') {
        e.preventDefault();
        performAttack();
      }

      // Jump
      if (e.key === ' ' || e.key === 'Alt' || e.key === 'ArrowUp' || e.key.toLowerCase() === 'w') {
        e.preventDefault();
        performJump();
      }

      // Pick up item
      if (e.key.toLowerCase() === 'z') {
        e.preventDefault();
        const nearby = droppedItems.find(
          (d) => Math.abs(d.x - player.x) < 45 && Math.abs(d.y - player.y) < 55
        );
        if (nearby) {
          pickupItem(nearby);
        }
      }

      // Toggle Inventory
      if (e.key.toLowerCase() === 'i') {
        e.preventDefault();
        bgmPlayer.playInventoryToggle();
        onOpenInventory();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [performAttack, performJump, droppedItems, player.x, player.y, pickupItem, onOpenInventory]);

  // Main Game Loop (Physics & Animation)
  useEffect(() => {
    let animationFrameId: number;
    const gravity = 0.55;

    const gameTick = () => {
      // 1. Update Player Movement & Gravity
      setPlayer((prev) => {
        let newVx = 0;
        let facing = prev.facing;

        if (keysPressed.current['arrowleft'] || keysPressed.current['a']) {
          newVx = -3.8;
          facing = 'left';
        } else if (keysPressed.current['arrowright'] || keysPressed.current['d']) {
          newVx = 3.8;
          facing = 'right';
        }

        let newVy = prev.vy + gravity;
        let newX = prev.x + newVx;
        let newY = prev.y + newVy;
        let grounded = false;

        // Boundary constraints
        if (newX < 20) newX = 20;
        if (newX > V_WIDTH - 50) newX = V_WIDTH - 50;

        // Platform collision checks (landing on top of platforms)
        const charWidth = 32;
        const charHeight = 44;

        platforms.forEach((plat) => {
          const wasAbove = prev.y + charHeight <= plat.y + 12;
          const isNowBelowOrAt = newY + charHeight >= plat.y;
          const isWithinX = newX + charWidth > plat.x && newX < plat.x + plat.w;

          if (wasAbove && isNowBelowOrAt && isWithinX && prev.vy >= 0) {
            newY = plat.y - charHeight;
            newVy = 0;
            grounded = true;
          }
        });

        // Decay attack animation timer
        let attackTimer = prev.attackTimer > 0 ? prev.attackTimer - 1 : 0;
        let isAttacking = attackTimer > 0;

        return {
          ...prev,
          x: newX,
          y: newY,
          vx: newVx,
          vy: newVy,
          isGrounded: grounded,
          facing,
          isAttacking,
          attackTimer,
          hasLandedOnce: true,
        };
      });

      // 2. Update Monsters Movement & Boundaries
      setMonsters((prevMonsters) =>
        prevMonsters.map((m) => {
          if (!m.isAlive) return m;

          const plat = platforms.find((p) => p.id === m.platformId);
          if (!plat) return m;

          let newX = m.x + m.vx;
          let newVx = m.vx;

          // Patrol boundaries on platform
          if (newX < plat.x + 10) {
            newX = plat.x + 10;
            newVx = Math.abs(m.vx);
          } else if (newX > plat.x + plat.w - 40) {
            newX = plat.x + plat.w - 40;
            newVx = -Math.abs(m.vx);
          }

          return {
            ...m,
            x: newX,
            vx: newVx,
          };
        })
      );

      // 3. Update Dropped Items Physics (bouncing to ground)
      setDroppedItems((prevItems) =>
        prevItems.map((item) => {
          let newY = item.y + item.vy;
          let newVy = item.vy + 0.4;
          let bounces = item.bounces;

          if (newY >= item.groundY) {
            newY = item.groundY;
            if (bounces < 2) {
              newVy = -item.vy * 0.45;
              bounces += 1;
            } else {
              newVy = 0;
            }
          }

          return {
            ...item,
            y: newY,
            vy: newVy,
            bounces,
            sparkleTime: item.sparkleTime + 1,
          };
        })
      );

      // 4. Update Damage Numbers (Floating up and fading out)
      setDamageNumbers((prevDmg) =>
        prevDmg
          .map((d) => ({
            ...d,
            y: d.y - 1.2,
            opacity: d.opacity - 0.025,
          }))
          .filter((d) => d.opacity > 0)
      );

      // 5. Update Arrow Projectiles
      setArrows((prevArrows) =>
        prevArrows
          .map((a) => ({
            ...a,
            x: a.x + a.vx,
            life: a.life - 1,
          }))
          .filter((a) => a.life > 0 && a.x > 0 && a.x < V_WIDTH)
      );

      animationFrameId = requestAnimationFrame(gameTick);
    };

    animationFrameId = requestAnimationFrame(gameTick);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // Monster direct click attack handler
  const handleMonsterClick = (m: Monster) => {
    if (!m.isAlive) return;
    performAttack();
  };

  // Demo helper to drop an item immediately
  const handleDemoDrop = () => {
    const randomItem = MAPLE_DROPPABLE_ITEMS[Math.floor(Math.random() * MAPLE_DROPPABLE_ITEMS.length)];
    bgmPlayer.playItemDrop();
    setDroppedItems((prev) => [
      ...prev,
      {
        id: `demo-${Date.now()}`,
        item: randomItem,
        x: player.x + (player.facing === 'right' ? 40 : -40),
        y: player.y,
        vy: -5,
        groundY: player.y + 15,
        bounces: 0,
        sparkleTime: 0,
      },
    ]);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PERSONAL_INFO.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  return (
    <div className="w-screen h-screen overflow-hidden flex flex-col bg-[#162132] text-stone-100 select-none relative font-sans">
      {/* 1. HEADER: Classic MapleStory White & Light Orange Theme */}
      <header className="z-40 h-13 sm:h-14 bg-gradient-to-r from-[#fffdf9] via-[#fff8ed] to-[#fff4e0] border-b-2 border-[#f5b875] shadow-md px-3 sm:px-6 flex items-center justify-between shrink-0 font-sans text-xs">
        {/* Left: Name & Title in MapleStory Light Orange styling */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-2 bg-gradient-to-b from-[#fff2de] to-[#ffe2bc] border-2 border-[#f29f42] px-3 py-1 rounded-lg shadow-xs">
            <MapleLeafIcon className="w-4 h-4 text-[#e0580c] animate-pulse shrink-0" />
            <span className="font-bold text-[#b44800] tracking-wide text-xs sm:text-sm">
              {PERSONAL_INFO.name}
            </span>
          </div>
          <span className="hidden sm:inline text-[#7a481c] font-medium text-xs">
            Senior Software Engineer @ RBC
          </span>
        </div>

        {/* Right: Quick Game Controls & Social Shortcuts */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* BGM Toggle Button */}
          <button
            onClick={handleToggleBgm}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer border ${
              isPlayingBgm
                ? 'bg-gradient-to-b from-[#ff8e26] to-[#e66c00] text-white border-[#b85000] shadow-sm animate-pulse'
                : 'bg-white hover:bg-[#fff6ea] text-[#854d19] border-[#f0c294]'
            }`}
            title={isPlayingBgm ? 'Mute Cozy Henesys BGM' : 'Play Cozy Henesys BGM'}
          >
            {isPlayingBgm ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-white" />
                <span className="hidden sm:inline font-mono">BGM: On ♫</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-[#b37540]" />
                <span className="hidden sm:inline font-mono">BGM: Off</span>
              </>
            )}
          </button>

          {/* Item Bag Shortcut Button */}
          <button
            onClick={() => {
              bgmPlayer.playInventoryToggle();
              onOpenInventory();
            }}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gradient-to-b from-[#ffffff] to-[#fff3e0] hover:from-[#fff7ed] hover:to-[#ffe7c4] text-[#8f4300] font-bold text-xs shadow-xs transition-colors cursor-pointer border-2 border-[#f5aa56]"
            title="Open Item Inventory (I)"
          >
            <Backpack className="w-3.5 h-3.5 text-[#e0580c]" />
            <span className="font-mono">[I] Bag</span>
            {inventory.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-[#e0580c] text-white text-[10px] font-bold font-mono">
                {inventory.length}
              </span>
            )}
          </button>

          {/* Official Resume PDF Button */}
          <button
            onClick={onOpenResume}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gradient-to-b from-[#ff8c21] to-[#e46400] hover:from-[#ffa142] hover:to-[#ed7100] text-white font-bold text-xs shadow-sm transition-all cursor-pointer border-2 border-[#bf4f00] active:scale-95"
            title="View Full Official Resume (PDF)"
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Resume (PDF)</span>
          </button>

          {/* Whisper / Contact Button */}
          <button
            onClick={() => setIsWhisperOpen(true)}
            className="inline-flex items-center gap-1 p-1.5 sm:px-2.5 sm:py-1 rounded-md bg-white hover:bg-[#fff5e6] text-[#784318] text-xs border border-[#f0be8e] transition-colors cursor-pointer"
            title="Whisper / Contact Hung"
          >
            <MessageCircle className="w-3.5 h-3.5 text-[#e0580c]" />
            <span className="hidden md:inline font-semibold">Whisper</span>
          </button>

          {/* Help Button */}
          <button
            onClick={() => setIsHelpOpen(true)}
            className="p-1.5 rounded-md bg-white hover:bg-[#fff5e6] text-[#804b1e] border border-[#f0be8e] transition-colors cursor-pointer"
            title="Controls & Lore Guide"
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </button>

          {/* Links */}
          <a
            href={PERSONAL_INFO.linkedin}
            target="_blank"
            rel="noreferrer"
            className="p-1.5 text-[#9e6231] hover:text-[#0284c7] transition-colors"
            title="LinkedIn Profile"
          >
            <Linkedin className="w-4 h-4" />
          </a>
          <a
            href={PERSONAL_INFO.github}
            target="_blank"
            rel="noreferrer"
            className="p-1.5 text-[#9e6231] hover:text-black transition-colors"
            title="GitHub Profile"
          >
            <Github className="w-4 h-4" />
          </a>
        </div>
      </header>

      {/* 2. THE MAPLESTORY MAP: Full Screen Center Stage */}
      <main
        ref={canvasContainerRef}
        className="flex-1 w-full relative overflow-hidden bg-cover bg-center select-none"
        style={{
          backgroundImage: `url('/maple_henesys_map.jpg')`,
          backgroundColor: '#87ceeb',
          backgroundSize: '100% 100%',
        }}
      >
        {/* Subtle Parallax Clouds Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-sky-400/10 via-transparent to-black/15 pointer-events-none" />

        {/* Climbing Ropes matching the Henesys Artwork */}
        <div
          className="absolute w-2 bg-[#8c6d48] border-x border-[#523d24] z-10 pointer-events-none"
          style={{ left: '590px', top: '0px', height: '80px' }}
        />
        <div
          className="absolute w-2 bg-[#8c6d48] border-x border-[#523d24] z-10 pointer-events-none"
          style={{ left: '745px', top: '28.7%', height: '28%' }}
        />
        <div
          className="absolute w-2 bg-[#8c6d48] border-x border-[#523d24] z-10 pointer-events-none"
          style={{ left: '460px', top: '57.4%', height: '30%' }}
        />

        {/* Wooden Arrow Signpost on ground */}
        <div
          className="absolute z-10 pointer-events-none flex flex-col items-center"
          style={{ left: '36.5%', top: '78.5%' }}
        >
          <div className="bg-[#b3804d] text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-[#6b4723] shadow-md rotate-[-3deg]">
            ➔ Henesys Town
          </div>
          <div className="w-2.5 h-7 bg-[#7c5630] border-x border-[#4d3219]" />
        </div>

        {/* Decorative Haybales */}
        <div
          className="absolute z-10 pointer-events-none"
          style={{ left: '19%', top: '82%' }}
        >
          <div className="w-11 h-8 bg-[#d4a359] rounded-md border border-[#8c642a] shadow-md flex items-center justify-center text-xs">
            🌾
          </div>
        </div>
        <div
          className="absolute z-10 pointer-events-none"
          style={{ left: '25%', top: '52.5%' }}
        >
          <div className="w-11 h-8 bg-[#d4a359] rounded-md border border-[#8c642a] shadow-md flex items-center justify-center text-xs">
            🌾
          </div>
        </div>

        {/* MONSTERS */}
        {monsters.map((m) => {
          if (!m.isAlive) return null;

          // Asset image mapping for MapleStory monsters
          const monsterImgSrc =
            m.type === 'mushroom'
              ? '/orange_mushroom.png'
              : m.type === 'slime'
              ? '/green_slime.png'
              : '/blue_snail.png';

          return (
            <div
              key={m.id}
              onClick={() => handleMonsterClick(m)}
              className="absolute z-20 cursor-pointer transition-transform hover:scale-110 active:scale-95 group select-none"
              style={{
                left: `${(m.x / V_WIDTH) * 100}%`,
                top: `${(m.y / V_HEIGHT) * 100}%`,
                width: m.type === 'mushroom' ? '54px' : m.type === 'slime' ? '46px' : '44px',
                height: m.type === 'mushroom' ? '54px' : m.type === 'slime' ? '46px' : '44px',
                transform: m.vx > 0 ? 'scaleX(-1)' : 'scaleX(1)',
              }}
              title={`Click to attack ${m.name}!`}
            >
              {/* Monster HP Bar */}
              <div
                className="absolute -top-3 left-1/2 -translate-x-1/2 w-10 h-1.5 bg-black/60 rounded-full overflow-hidden border border-black/40 pointer-events-none"
                style={{ transform: m.vx > 0 ? 'scaleX(-1)' : 'scaleX(1)' }}
              >
                <div
                  className="h-full bg-red-500 transition-all duration-100"
                  style={{ width: `${(m.currentHp / m.maxHp) * 100}%` }}
                />
              </div>

              {/* Monster Name tag */}
              <div
                className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-mono font-bold text-white bg-black/60 px-1 rounded pointer-events-none shadow-xs"
                style={{ transform: m.vx > 0 ? 'scaleX(-1)' : 'scaleX(1)' }}
              >
                {m.name}
              </div>

              {/* Monster Sprite Image Asset with gentle idle bobbing */}
              <div className="relative w-full h-full flex items-end justify-center">
                <img
                  src={monsterImgSrc}
                  alt={m.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)] pointer-events-none select-none transition-transform duration-100 group-hover:brightness-110"
                  style={{
                    imageRendering: 'auto',
                  }}
                />
              </div>
            </div>
          );
        })}

        {/* DROPPED ITEMS ON FIELD */}
        {droppedItems.map((drop) => (
          <div
            key={drop.id}
            onClick={() => pickupItem(drop)}
            className="absolute z-30 cursor-pointer group animate-pulse"
            style={{
              left: `${(drop.x / V_WIDTH) * 100}%`,
              top: `${(drop.y / V_HEIGHT) * 100}%`,
              width: '34px',
              height: '34px',
            }}
            title={`Click or press [Z] to pick up ${drop.item.name}`}
          >
            <div className="absolute -inset-1 rounded-full bg-amber-400/40 blur-xs animate-ping" />

            <div className="relative w-8 h-8 rounded-lg bg-white/95 border-2 border-amber-500 shadow-xl flex items-center justify-center text-sm transform hover:scale-125 transition-transform">
              {drop.item.icon === 'scroll-gold' && '📜'}
              {drop.item.icon === 'cap-emerald' && '🍄'}
              {drop.item.icon === 'book-blue' && '📘'}
              {drop.item.icon === 'medal-maple' && '🍁'}
              {drop.item.icon === 'orb-purple' && '🔮'}
              {drop.item.icon === 'chip-cyan' && '💾'}
              {drop.item.icon === 'potion-red' && '🧪'}
              {drop.item.icon === 'diploma-blue' && '🎓'}
            </div>

            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-[8px] font-mono font-bold text-amber-950 bg-amber-200/90 px-1 rounded shadow-xs">
              Pick up [Z]
            </div>
          </div>
        ))}

        {/* FLOATING DAMAGE NUMBERS */}
        {damageNumbers.map((dmg) => (
          <div
            key={dmg.id}
            className="absolute z-40 pointer-events-none font-extrabold tracking-wider select-none font-mono"
            style={{
              left: `${(dmg.x / V_WIDTH) * 100}%`,
              top: `${(dmg.y / V_HEIGHT) * 100}%`,
              opacity: dmg.opacity,
              transform: 'translate(-50%, -50%)',
              color: dmg.isCritical ? '#ff1e1e' : '#f97316',
              textShadow:
                '2px 2px 0px #ffffff, -2px -2px 0px #ffffff, 2px -2px 0px #ffffff, -2px 2px 0px #ffffff, 0px 3px 6px rgba(0,0,0,0.8)',
              fontSize: dmg.isCritical ? '24px' : '19px',
            }}
          >
            {dmg.isCritical ? `CRIT ${dmg.value}` : dmg.value}
          </div>
        ))}

        {/* ARROW PROJECTILES (Shot by Archer) */}
        {arrows.map((arrow) => (
          <div
            key={arrow.id}
            className="absolute z-35 pointer-events-none flex items-center"
            style={{
              left: `${(arrow.x / V_WIDTH) * 100}%`,
              top: `${(arrow.y / V_HEIGHT) * 100}%`,
              transform: arrow.facing === 'left' ? 'scaleX(-1)' : 'scaleX(1)',
            }}
          >
            {/* MapleStory Archer Arrow Sprite */}
            <div className="relative flex items-center">
              {/* Arrow shaft */}
              <div className="w-6 h-1 bg-[#8c5a2b] border-y border-[#4a2e12] relative shadow-sm">
                {/* Arrow head */}
                <div className="absolute -right-2 -top-1 w-0 h-0 border-t-3 border-t-transparent border-b-3 border-b-transparent border-l-4 border-l-stone-300 filter drop-shadow-sm" />
                {/* Feather fletching */}
                <div className="absolute -left-1.5 -top-1 w-2 h-3 bg-red-500 rounded-l-xs opacity-90" />
              </div>
              {/* Yellow glow trail */}
              <div className="w-4 h-1 bg-gradient-to-r from-transparent to-amber-300 blur-xs -ml-2" />
            </div>
          </div>
        ))}

        {/* THE PLAYER CHARACTER: MapleStory Archer (Dropping in on load & controllable) */}
        <div
          className="absolute z-30 transition-none select-none"
          style={{
            left: `${(player.x / V_WIDTH) * 100}%`,
            top: `${(player.y / V_HEIGHT) * 100}%`,
            width: '56px',
            height: '68px',
            transform: player.facing === 'left' ? 'scaleX(-1)' : 'scaleX(1)',
          }}
        >
          {/* FLOATING TEXT SPEECH BUBBLE OVER CHARACTER HEAD */}
          <div
            className="absolute -top-14 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
            style={{ transform: player.facing === 'left' ? 'scaleX(-1)' : 'scaleX(1)' }}
          >
            <div className="relative bg-white/95 text-stone-900 border-2 border-amber-600 rounded-xl px-3 py-1.5 shadow-2xl whitespace-nowrap animate-bounce flex items-center gap-1.5 text-xs font-mono font-extrabold">
              <MapleLeafIcon className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>Click [X] to attack monster & learn more about me!</span>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-amber-600" />
            </div>
          </div>

          {/* Archer Sprite Visual */}
          <div className="relative w-full h-full flex items-end justify-center">
            <img
              src="/archer_character.png"
              alt="Archer Player"
              referrerPolicy="no-referrer"
              className={`w-full h-full object-contain filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.45)] pointer-events-none select-none transition-transform ${
                player.isAttacking ? 'scale-110 -translate-y-1' : ''
              }`}
              style={{
                imageRendering: 'auto',
              }}
            />

            {/* Bow Shot Flash / Arrow Effect during Attack */}
            {player.isAttacking && (
              <div className="absolute -right-3 top-4 w-9 h-9 pointer-events-none animate-ping">
                <div className="w-full h-full rounded-full border-2 border-amber-300 bg-amber-400/30" />
              </div>
            )}
          </div>

          {/* Character Name Tag */}
          <div
            className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-mono font-bold text-amber-200 bg-black/75 px-1.5 py-0.2 rounded border border-amber-500/50 pointer-events-none shadow-sm"
            style={{ transform: player.facing === 'left' ? 'scaleX(-1)' : 'scaleX(1)' }}
          >
            Hung Nguyen (Archer)
          </div>
        </div>

        {/* Floating toast notification when item is picked up */}
        {toastMessage && (
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 bg-[#0d1b2a]/95 text-amber-300 border-2 border-amber-400 px-4 py-2 rounded-xl shadow-2xl font-mono text-xs font-bold animate-in fade-in slide-in-from-top-2 duration-200 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
            <span>{toastMessage}</span>
          </div>
        )}
      </main>

      {/* 3. FOOTER: White & Light Orange MapleStory Controls Bar */}
      <footer className="z-40 h-14 sm:h-15 bg-gradient-to-r from-[#fffdfa] via-[#fff8ef] to-[#fff3e0] border-t-2 border-[#f5b875] shadow-lg px-3 sm:px-6 flex items-center justify-between font-sans text-[#784318] shrink-0 select-none">
        {/* Left: Quick Hint / Guide */}
        <div className="hidden sm:flex items-center gap-2 text-xs">
          <div className="w-2 h-2 rounded-full bg-[#f97316] animate-ping" />
          <span className="font-semibold text-[#8f4300]">Controls:</span>
          <span className="text-[#a1622c] font-mono text-[11px]">[A/D] Walk • [Space] Jump • [X] Attack • [Z] Pick Up • [I] Bag</span>
        </div>

        {/* Center/Main: Action Buttons (Touch & Mouse Ready) in light orange / maple theme */}
        <div className="flex items-center justify-center gap-1.5 sm:gap-2 w-full sm:w-auto">
          {/* Walk Left */}
          <button
            onMouseDown={() => setVirtualKey('arrowleft', true)}
            onMouseUp={() => setVirtualKey('arrowleft', false)}
            onTouchStart={() => setVirtualKey('arrowleft', true)}
            onTouchEnd={() => setVirtualKey('arrowleft', false)}
            className="px-2.5 py-1.5 bg-white hover:bg-[#fff5e6] border-2 border-[#f5c290] rounded-lg text-[#7c4419] text-xs font-semibold flex items-center gap-1 cursor-pointer active:scale-95 shadow-xs"
            title="Walk Left [A / ←]"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#e0580c]" />
            <span className="font-mono text-[11px]">Left</span>
          </button>

          {/* Walk Right */}
          <button
            onMouseDown={() => setVirtualKey('arrowright', true)}
            onMouseUp={() => setVirtualKey('arrowright', false)}
            onTouchStart={() => setVirtualKey('arrowright', true)}
            onTouchEnd={() => setVirtualKey('arrowright', false)}
            className="px-2.5 py-1.5 bg-white hover:bg-[#fff5e6] border-2 border-[#f5c290] rounded-lg text-[#7c4419] text-xs font-semibold flex items-center gap-1 cursor-pointer active:scale-95 shadow-xs"
            title="Walk Right [D / →]"
          >
            <span className="font-mono text-[11px]">Right</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#e0580c]" />
          </button>

          {/* Jump */}
          <button
            onClick={performJump}
            className="px-3 sm:px-3.5 py-1.5 bg-gradient-to-b from-[#ffffff] to-[#fff1dc] hover:from-[#fff7eb] hover:to-[#ffe5c2] border-2 border-[#f0a95e] rounded-lg text-[#853e00] text-xs font-bold flex items-center gap-1 cursor-pointer active:scale-95 shadow-xs"
            title="Jump [Space / W]"
          >
            <ArrowUp className="w-3.5 h-3.5 text-[#e0580c]" />
            <span className="font-mono text-[11px]">[Space] Jump</span>
          </button>

          {/* Attack */}
          <button
            onClick={performAttack}
            className="px-3.5 sm:px-4 py-1.5 bg-gradient-to-b from-[#ff8c21] to-[#e46400] hover:from-[#ffa03d] hover:to-[#ed7100] border-2 border-[#bf4f00] rounded-lg text-white text-xs font-extrabold flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-sm"
            title="Attack [X / Ctrl]"
          >
            <Sword className="w-3.5 h-3.5 text-white" />
            <span className="font-mono text-[11px]">[X] Attack</span>
          </button>

          {/* Open Bag */}
          <button
            onClick={() => {
              bgmPlayer.playInventoryToggle();
              onOpenInventory();
            }}
            className="px-3 sm:px-3.5 py-1.5 bg-gradient-to-b from-[#ffffff] to-[#fff3e0] hover:from-[#fff8ed] hover:to-[#ffe7c4] border-2 border-[#f5aa56] rounded-lg text-[#8f4300] text-xs font-bold flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-xs"
            title="Open Bag [I]"
          >
            <Backpack className="w-3.5 h-3.5 text-[#e0580c]" />
            <span className="font-mono text-[11px]">[I] Bag</span>
          </button>
        </div>

        {/* Right: Quick lore text / status */}
        <div className="hidden md:flex items-center gap-2 text-xs">
          <span className="text-[#a1622c] text-[11px] font-medium">Click monsters or items on stage</span>
        </div>
      </footer>

      {/* WHISPER / CONTACT MODAL (Authentic MapleStory Message Box) */}
      {isWhisperOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          onClick={() => setIsWhisperOpen(false)}
        >
          <div
            className="w-full max-w-md bg-[#d7cfbd] rounded-t-xl rounded-b-lg border-2 border-[#5c4a38] shadow-2xl overflow-hidden font-sans text-stone-900"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Title Bar */}
            <div className="bg-gradient-to-r from-[#2c4060] to-[#1e2c44] text-white px-3 py-2 flex items-center justify-between border-b-2 border-[#162132]">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold font-mono">Whisper to Hung Nguyen</span>
              </div>
              <button
                onClick={() => setIsWhisperOpen(false)}
                className="w-4 h-4 bg-red-600 hover:bg-red-500 text-white rounded flex items-center justify-center text-xs font-bold cursor-pointer"
              >
                ×
              </button>
            </div>

            {/* Content Body */}
            <div className="p-4 space-y-3 bg-[#ece4d6] text-xs font-mono">
              <p className="text-stone-700 leading-relaxed">
                Send a direct transmission to Hung Nguyen (Senior Software Engineer @ RBC). Available for high-impact software engineering opportunities!
              </p>

              <div className="bg-white p-3 rounded-lg border border-[#a89982] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">Email:</span>
                  <div className="flex items-center gap-2 font-bold text-stone-900">
                    <span>{PERSONAL_INFO.email}</span>
                    <button
                      onClick={handleCopyEmail}
                      className="p-1 rounded hover:bg-amber-100 text-amber-800 transition-colors cursor-pointer"
                      title="Copy Email"
                    >
                      {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-stone-500">Phone:</span>
                  <span className="font-bold text-stone-900">{PERSONAL_INFO.phone}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-stone-500">Location:</span>
                  <span className="font-bold text-stone-900">{PERSONAL_INFO.location}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-stone-500">LinkedIn:</span>
                  <a
                    href={PERSONAL_INFO.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold text-sky-700 hover:underline"
                  >
                    linkedin.com/in/nguyensdev
                  </a>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <a
                  href={`mailto:${PERSONAL_INFO.email}`}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Send Direct Email</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* HELP & CONTROLS MODAL */}
      {isHelpOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          onClick={() => setIsHelpOpen(false)}
        >
          <div
            className="w-full max-w-md bg-[#d7cfbd] rounded-t-xl rounded-b-lg border-2 border-[#5c4a38] shadow-2xl overflow-hidden font-sans text-stone-900"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Title Bar */}
            <div className="bg-gradient-to-r from-[#2c4060] to-[#1e2c44] text-white px-3 py-2 flex items-center justify-between border-b-2 border-[#162132]">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold font-mono">Adventurer Controls & Game Lore</span>
              </div>
              <button
                onClick={() => setIsHelpOpen(false)}
                className="w-4 h-4 bg-red-600 hover:bg-red-500 text-white rounded flex items-center justify-center text-xs font-bold cursor-pointer"
              >
                ×
              </button>
            </div>

            {/* Content Body */}
            <div className="p-4 space-y-3 bg-[#ece4d6] text-xs font-mono">
              <div className="bg-white p-3 rounded-lg border border-[#a89982] space-y-2">
                <h4 className="font-bold text-amber-900 text-[11px] uppercase tracking-wider">
                  Game Controls
                </h4>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div><span className="font-bold text-amber-700">[A] / [D]</span> or <span className="font-bold text-amber-700">[←] / [→]</span> : Walk</div>
                  <div><span className="font-bold text-amber-700">[Space]</span> / <span className="font-bold text-amber-700">[W]</span> : Jump</div>
                  <div><span className="font-bold text-amber-700">[X]</span> or <span className="font-bold text-amber-700">Click</span> : Attack</div>
                  <div><span className="font-bold text-amber-700">[Z]</span> : Pick up Item</div>
                  <div className="col-span-2"><span className="font-bold text-amber-700">[I]</span> : Toggle Item Inventory Bag</div>
                </div>
              </div>

              <div className="bg-white p-3 rounded-lg border border-[#a89982] space-y-1.5">
                <h4 className="font-bold text-amber-900 text-[11px] uppercase tracking-wider">
                  How to Explore Resume
                </h4>
                <p className="text-stone-700 leading-relaxed text-[11px]">
                  1. Attack roaming monsters on the map to defeat them.
                </p>
                <p className="text-stone-700 leading-relaxed text-[11px]">
                  2. Monsters drop enchanted resume relics, scrolls, and armor.
                </p>
                <p className="text-stone-700 leading-relaxed text-[11px]">
                  3. Walk over items and press <span className="font-bold text-amber-800">[Z]</span> or click them to store in your bag.
                </p>
                <p className="text-stone-700 leading-relaxed text-[11px]">
                  4. Press <span className="font-bold text-amber-800">[I]</span> to open your inventory and hover over any item to inspect its real-world engineering stats and metrics!
                </p>
              </div>

              <div className="flex justify-between items-center pt-1">
                <button
                  onClick={handleDemoDrop}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Spawn Random Drop</span>
                </button>
                <button
                  onClick={() => setIsHelpOpen(false)}
                  className="px-4 py-1.5 bg-stone-700 hover:bg-stone-600 text-white font-bold rounded-lg transition-all cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
