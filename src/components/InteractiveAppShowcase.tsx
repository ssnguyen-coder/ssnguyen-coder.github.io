import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RefreshCw, Zap, Server, Activity, ShieldCheck, Database, Sliders, AlertTriangle, CheckCircle } from 'lucide-react';

interface StreamPacket {
  id: string;
  timestamp: string;
  source: string;
  topic: string;
  sizeBytes: number;
  latencyMs: number;
  status: 'delivered' | 'dropped' | 'retried';
}

export const InteractiveAppShowcase: React.FC = () => {
  const [isRunning, setIsRunning] = useState(true);
  const [rate, setRate] = useState<number>(4); // events per second tick
  const [errorSimulation, setErrorSimulation] = useState<boolean>(false);
  const [activeNodes, setActiveNodes] = useState<{ [key: string]: boolean }>({
    'node-alpha': true,
    'node-beta': true,
    'node-gamma': true,
  });

  const [packets, setPackets] = useState<StreamPacket[]>([
    {
      id: 'pkt_94a2b',
      timestamp: '10:10:04.120',
      source: 'gateway-ingress-1',
      topic: 'user.auth.session',
      sizeBytes: 1420,
      latencyMs: 14,
      status: 'delivered',
    },
    {
      id: 'pkt_94a2c',
      timestamp: '10:10:04.340',
      source: 'worker-checkout',
      topic: 'payments.charge.intent',
      sizeBytes: 2840,
      latencyMs: 19,
      status: 'delivered',
    },
    {
      id: 'pkt_94a2d',
      timestamp: '10:10:04.680',
      source: 'event-broker-east',
      topic: 'inventory.reserve.sku',
      sizeBytes: 980,
      latencyMs: 12,
      status: 'delivered',
    }
  ]);

  const [stats, setStats] = useState({
    totalProcessed: 14280,
    currentThroughput: 1240,
    p99Latency: 18,
    bufferUsage: 34,
  });

  const logsContainerRef = useRef<HTMLDivElement>(null);

  // Auto-generate stream events
  useEffect(() => {
    if (!isRunning) return;

    const sources = ['gateway-ingress-1', 'worker-checkout', 'event-broker-east', 'api-router'];
    const topics = ['user.auth.session', 'payments.charge.intent', 'inventory.reserve.sku', 'telemetry.metric.p99', 'audit.log.event'];

    const interval = setInterval(() => {
      const activeKeys = Object.keys(activeNodes).filter(k => activeNodes[k]);
      if (activeKeys.length === 0) return;

      const randomSource = sources[Math.floor(Math.random() * sources.length)];
      const randomTopic = topics[Math.floor(Math.random() * topics.length)];
      const isDropped = errorSimulation && Math.random() < 0.25;
      const isRetried = !isDropped && errorSimulation && Math.random() < 0.2;

      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}.${now.getMilliseconds().toString().padStart(3, '0')}`;

      const newPacket: StreamPacket = {
        id: 'pkt_' + Math.random().toString(36).substring(2, 7),
        timestamp: timeStr,
        source: randomSource,
        topic: randomTopic,
        sizeBytes: Math.floor(Math.random() * 2200) + 400,
        latencyMs: isRetried ? Math.floor(Math.random() * 40) + 35 : Math.floor(Math.random() * 16) + 9,
        status: isDropped ? 'dropped' : isRetried ? 'retried' : 'delivered',
      };

      setPackets(prev => [newPacket, ...prev.slice(0, 14)]);
      setStats(prev => ({
        totalProcessed: prev.totalProcessed + 1,
        currentThroughput: Math.floor(1150 + Math.random() * 280),
        p99Latency: Math.floor(15 + Math.random() * 8),
        bufferUsage: Math.min(95, Math.floor(25 + Math.random() * 20)),
      }));
    }, 1000 / rate);

    return () => clearInterval(interval);
  }, [isRunning, rate, errorSimulation, activeNodes]);

  const injectSurge = () => {
    setStats(prev => ({
      ...prev,
      currentThroughput: 3840,
      p99Latency: 42,
      bufferUsage: 88,
    }));

    const surgePackets: StreamPacket[] = Array.from({ length: 5 }).map((_, i) => ({
      id: 'surge_' + Math.random().toString(36).substring(2, 7),
      timestamp: new Date().toLocaleTimeString(),
      source: 'load-tester-surge',
      topic: 'stress.test.burst.traffic',
      sizeBytes: 4200,
      latencyMs: 38 + i * 3,
      status: 'delivered',
    }));

    setPackets(prev => [...surgePackets, ...prev.slice(0, 12)]);
  };

  const toggleNode = (nodeKey: string) => {
    setActiveNodes(prev => ({
      ...prev,
      [nodeKey]: !prev[nodeKey]
    }));
  };

  return (
    <section id="live-app" className="py-16 md:py-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-stone-200/80">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100/70 text-emerald-800 text-xs font-semibold font-mono mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Interactive App Showcase
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
              PulseGrid Live Stream Engine
            </h2>
            <p className="text-stone-600 text-sm sm:text-base mt-2 max-w-2xl">
              An interactive demonstration of the distributed event stream architecture built by Sean. Test cluster nodes, simulate load surges, and monitor telemetry in real-time.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all shadow-xs active:scale-95 ${
                isRunning
                  ? 'bg-stone-900 text-stone-50 hover:bg-stone-800'
                  : 'bg-emerald-600 text-white hover:bg-emerald-500'
              }`}
            >
              {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isRunning ? 'Pause Engine' : 'Resume Engine'}</span>
            </button>

            <button
              onClick={injectSurge}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 text-xs font-semibold transition-all active:scale-95"
              title="Inject sudden traffic surge into the cluster"
            >
              <Zap className="w-3.5 h-3.5 text-amber-600" />
              <span>Simulate Burst</span>
            </button>
          </div>
        </div>

        {/* The Live Console Panel */}
        <div className="rounded-2xl border border-stone-800 bg-stone-950 text-stone-100 shadow-xl overflow-hidden font-mono">
          {/* Top Bar with Status Indicators */}
          <div className="p-4 sm:p-5 bg-stone-900/90 border-b border-stone-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-bold text-stone-200">CLUSTER STATUS: HEALTHY</span>
              </div>
              <span className="text-stone-600">|</span>
              <span className="text-xs text-stone-400">Region: us-west-1a</span>
            </div>

            {/* Worker Nodes toggle buttons */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-stone-400 text-[11px]">Worker Shards:</span>
              {Object.keys(activeNodes).map((node) => (
                <button
                  key={node}
                  onClick={() => toggleNode(node)}
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold border transition-all ${
                    activeNodes[node]
                      ? 'bg-stone-800 border-emerald-500/50 text-emerald-300'
                      : 'bg-stone-900 border-stone-800 text-stone-600 line-through'
                  }`}
                  title="Click to toggle worker pod online/offline"
                >
                  {node.replace('node-', '')}
                </button>
              ))}
            </div>
          </div>

          {/* Telemetry Metrics HUD Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-stone-800">
            <div className="p-4 bg-stone-950">
              <div className="text-[11px] text-stone-400 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                Throughput
              </div>
              <div className="text-xl font-bold text-stone-100 mt-1">
                {stats.currentThroughput.toLocaleString()} <span className="text-xs font-normal text-stone-500">evt/s</span>
              </div>
            </div>

            <div className="p-4 bg-stone-950">
              <div className="text-[11px] text-stone-400 flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-sky-400" />
                P99 Latency
              </div>
              <div className="text-xl font-bold text-stone-100 mt-1">
                {stats.p99Latency} <span className="text-xs font-normal text-stone-500">ms</span>
              </div>
            </div>

            <div className="p-4 bg-stone-950">
              <div className="text-[11px] text-stone-400 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-purple-400" />
                Ring Buffer
              </div>
              <div className="text-xl font-bold text-stone-100 mt-1">
                {stats.bufferUsage}% <span className="text-xs font-normal text-stone-500">capacity</span>
              </div>
            </div>

            <div className="p-4 bg-stone-950">
              <div className="text-[11px] text-stone-400 flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                Processed
              </div>
              <div className="text-xl font-bold text-stone-100 mt-1">
                {stats.totalProcessed.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Interactive Controls Bar */}
          <div className="p-4 bg-stone-900/60 border-y border-stone-800 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <span className="text-stone-400 flex items-center gap-1.5 text-[11px]">
                <Sliders className="w-3.5 h-3.5 text-stone-500" />
                Ingest Rate:
              </span>
              <div className="flex items-center gap-1">
                {[1, 4, 8].map((speed) => (
                  <button
                    key={speed}
                    onClick={() => setRate(speed)}
                    className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                      rate === speed
                        ? 'bg-stone-100 text-stone-950'
                        : 'bg-stone-800 text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 cursor-pointer select-none text-[11px] text-stone-400 hover:text-stone-200">
                <input
                  type="checkbox"
                  checked={errorSimulation}
                  onChange={(e) => setErrorSimulation(e.target.checked)}
                  className="rounded bg-stone-800 border-stone-700 text-amber-500 focus:ring-0"
                />
                <span className="flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-amber-400" />
                  Simulate Jitter & Packet Retries
                </span>
              </label>
            </div>
          </div>

          {/* Live Ingestion Stream Table */}
          <div
            ref={logsContainerRef}
            className="p-4 sm:p-5 max-h-72 overflow-y-auto space-y-1.5 text-xs select-none"
          >
            <div className="grid grid-cols-12 text-[10px] uppercase text-stone-500 pb-2 border-b border-stone-800 font-bold">
              <span className="col-span-2">Packet ID</span>
              <span className="col-span-3">Topic</span>
              <span className="col-span-3">Source Node</span>
              <span className="col-span-2">Latency</span>
              <span className="col-span-2 text-right">Status</span>
            </div>

            {packets.map((pkt) => (
              <div
                key={pkt.id}
                className="grid grid-cols-12 items-center py-1.5 px-2 rounded hover:bg-stone-900 transition-colors text-[11px]"
              >
                <span className="col-span-2 text-stone-400 font-bold">{pkt.id}</span>
                <span className="col-span-3 text-stone-200 truncate">{pkt.topic}</span>
                <span className="col-span-3 text-stone-400 truncate">{pkt.source}</span>
                <span className="col-span-2 text-sky-400 font-semibold">{pkt.latencyMs}ms</span>
                <div className="col-span-2 text-right">
                  {pkt.status === 'delivered' && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800/60">
                      DELIVERED
                    </span>
                  )}
                  {pkt.status === 'retried' && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-950 text-amber-400 border border-amber-800/60">
                      RETRY
                    </span>
                  )}
                  {pkt.status === 'dropped' && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-red-950 text-red-400 border border-red-800/60">
                      DROPPED
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Console Footer */}
          <div className="p-3 bg-stone-900 border-t border-stone-800 flex items-center justify-between text-[11px] text-stone-500">
            <span>Built with Go, React 19 Canvas, and WebSocket multiplexing</span>
            <span className="hidden sm:inline">Sean Nguyen Architecture Portfolio</span>
          </div>
        </div>
      </div>
    </section>
  );
};
