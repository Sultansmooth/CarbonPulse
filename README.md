# Carbon Pulse

A network management dashboard for monitoring and managing ASUS router fleets. Built as a PRTG-style monitoring interface with a dark, data-dense UI designed for NOC/operations use.

![Next.js](https://img.shields.io/badge/Next.js-14.2-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwindcss)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker)

## Overview

Carbon Pulse provides a unified view across a mixed fleet of ASUS routers (RT-AX55, RT-AX88U, RT-AX58U, RP-AX56) with 22 infrastructure devices and 32 client endpoints. The dashboard surfaces real-time metrics, AI-driven insights, and network health scoring across the entire deployment.

## Pages

| Route | Description |
|-------|-------------|
| `/` | **Dashboard** - Fleet overview with stat cards, 24h throughput chart, AI insights panel, alert feed, and device quick-view grid |
| `/devices` | **Device Management** - Tabbed view (All / Infrastructure / Network Devices) with model-specific icons, 30-day uptime bars, CPU/memory gauges, type filters, and search |
| `/devices/[id]` | **Device Detail** - Per-AP deep dive with client list, channel utilization, throughput history, and configuration |
| `/wifi` | **WiFi Networks** - SSID management, radio configuration (2.4GHz/5GHz), security settings, ISP/WAN monitoring with AT&T/Spectrum cards and 30-day uptime history |
| `/network-map` | **Network Map** - Draggable topology visualization showing device connections, roles, and status with interactive positioning |
| `/analytics` | **Analytics** - Bandwidth trends (SVG line charts), device distribution, top/bottom AP rankings, channel usage analysis, health sparklines, role donut chart |
| `/roaming` | **Roaming** - 802.11r/k/v roaming analytics, event timeline, seamless vs disrupted roam tracking, per-client roaming paths |
| `/vlans` | **VLANs** - VLAN configuration and traffic segmentation overview |
| `/firmware` | **Firmware** - Fleet firmware status, update tracking, version distribution |
| `/alerts` | **Alerts** - Centralized alert feed with severity filtering (critical, warning, info, AI-insight) |
| `/ai-control` | **AI Control** - AI engine configuration, optimization toggles, recommendation management |
| `/settings` | **Settings** - System configuration and preferences |

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3.4 with custom dark navy theme
- **Icons**: Inline SVG (Heroicons-style) + product images
- **Data**: Static mock data (no backend required)
- **Deployment**: Docker with multi-stage build (standalone output)

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
npm start
```

### Docker

```bash
docker build -t carbon-pulse .
docker run -p 3000:3000 carbon-pulse
```

## Project Structure

```
src/
  app/
    page.tsx              # Dashboard
    layout.tsx            # Root layout with sidebar
    globals.css           # Global styles + custom theme
    devices/
      page.tsx            # Device management (infrastructure + clients)
      [id]/page.tsx       # Per-device detail
    wifi/page.tsx         # WiFi & WAN monitoring
    network-map/page.tsx  # Topology visualization
    analytics/page.tsx    # Charts & analytics
    roaming/page.tsx      # 802.11r/k/v roaming
    vlans/page.tsx        # VLAN management
    firmware/page.tsx     # Firmware tracking
    alerts/page.tsx       # Alert center
    ai-control/page.tsx   # AI engine config
    settings/page.tsx     # System settings
  components/
    Sidebar.tsx           # Navigation sidebar
  lib/
    mock-data.ts          # All mock data, types, and interfaces
```

## Design

- **Theme**: Dark navy (`navy-850/900/950`) with teal (`carbon-400/500`) accents
- **Typography**: Geist font family via `next/font`
- **Layout**: Fixed sidebar + scrollable content area
- **Cards**: Subtle glow effect (`card-glow`), slate borders, backdrop blur on headers
- **Data Density**: Designed for information-rich displays with compact stat cards, inline charts, and tabular data

## Device Models

| Model | Role | Icon |
|-------|------|------|
| RT-AX88U | Gateway / High-performance AP | SVG - 3 antennas with LED indicators |
| RT-AX55 | Access Point / Mesh Node | Product photo (`/rt-ax55.png`) |
| RT-AX58U | Mesh Node | SVG - 2 antennas |
| RP-AX56 | Range Extender / Repeater | SVG - signal waves, plug form factor |

## Client Device Types

Phone, Laptop, Desktop, Printer, Tablet, IoT, Smart TV, Gaming Console, VoIP Phone, Security Camera - each with a unique SVG icon and color scheme.

## License

Private project.
