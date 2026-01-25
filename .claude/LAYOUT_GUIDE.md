# Dendrite Network - Layout Visual Guide

## Layout Comparison

### 1. Hierarchical ⬇️
```
     Phase 0          Phase 1          Phase 2
        │                │                │
    ┌───┼───┐        ┌───┼───┐        ┌───┼───┐
    │   │   │        │   │   │        │   │   │
   T1  T2  T3       T4  T5  T6       T7  T8  T9
```
**Use Case:** Understanding sequential structure
**Layout:** Vertical cascade, tasks in grid below phases

---

### 2. Timeline ➡️
```
Phase 0 ──→ Phase 1 ──→ Phase 2 ──→ Phase 3
   │           │           │           │
  T1          T4          T7          T10
  T2          T5          T8          T11
  T3          T6          T9          T12
```
**Use Case:** Project timeline visualization
**Layout:** Horizontal progression with vertical task lists

---

### 3. Red Circular 🔵
```
        Phase 0
           ●
      T1 T2 T3

Phase 5 ●     ● Phase 1
  T15         T4 T5
  T16         T6

      Phase 4
         ●
    T13 T14

        Phase 3
           ●
      T10 T11 T12
```
**Use Case:** Seeing phase relationships
**Layout:** Circular phase arrangement with clustered tasks

---

### 4. Radial Burst ⭐ (NEW)
```
               T2
              /
         T1 - Phase 0 - T3
              \
               T4
      
   T6 - Phase 1
   |
   T7        CENTER        Phase 2 - T9
                                    |
                                   T10
         Phase 5 - T16
              \
               T17
              
         Phase 4 - T14
              /
            T13
```
**Use Case:** Project maturity visualization
**Layout:** Radial spokes, completed phases move toward center
**Special:** Dynamic radius based on completion status

---

### 5. Galaxy Spiral 🌌 (NEW)
```
                T2
               /
    Phase 0 - T1
           \
            T3
                  T5
                 /
         Phase 1 - T4
              \
               T6
                      T8
                     /
             Phase 2 - T7
                  \
                   T9
                           T11
                          /
                  Phase 3 - T10
                       \
                        T12
```
**Use Case:** Sequential evolution visualization
**Layout:** Phases spiral outward, tasks orbit their phase
**Special:** Spiral factor increases with phase index

---

### 6. Organic Clusters 💧 (NEW)
```
    T2   T1             T7  T8
      \ /                \ /
    Phase 0           Phase 2
      / \                / \
    T3   T4          T9   T10

         T5  T6
          \ /
        Phase 1
          / \
       T11  T12

    T13  T14          T16  T17
      \ /               \ /
    Phase 3           Phase 5
      / \               / \
   T15  T18          T19  T20
```
**Use Case:** Natural groupings, minimize edge crossings
**Layout:** Physics-based force simulation
**Special:** D3 forces: link, charge, center, collision

---

### 7. Swim Lanes 🏊 (NEW)
```
         ┌─ COMPLETED ────────────────────┐
Phase 0  │  T1    T4    T9    T12         │
Phase 1  │  T2    T5    T10               │
         └─────────────────────────────────┘
         
         ┌─ IN PROGRESS ──────────────────┐
Phase 2  │  T13   T16                     │
Phase 3  │  T14                           │
         └─────────────────────────────────┘
         
         ┌─ PENDING ──────────────────────┐
Phase 4  │  T17   T18   T19   T20         │
Phase 5  │  T21   T22                     │
         └─────────────────────────────────┘
         
         ┌─ BLOCKED ──────────────────────┐
         │  T23                           │
         └─────────────────────────────────┘
```
**Use Case:** Kanban-style workflow, status overview
**Layout:** Horizontal lanes by status, phases on left
**Special:** Clear status separation, easy to spot bottlenecks

---

### 8. Network Graph 🕸️ (NEW)
```
                 T2
                /│\
               / │ \
         Phase 0─┼──T1
            │    │  │
            │    └─T3
            │       │
       ┌────┴────┐  │
       │         │  │
    Phase 1   Phase 2
      /│\       /│\
     / │ \     / │ \
   T4─T5─T6  T7─T8─T9
     │  │     │  │
     └──┼─────┘  │
        │        │
     Phase 3  Phase 4
       /│\      /│\
      / │ \    / │ \
   T10 T11 T12 T13 T14
```
**Use Case:** Complete dependency analysis, critical paths
**Layout:** Full network with all relationships
**Special:** Shows phase links, task deps, phase-task connections
**Edge Types:**
- Purple dashed = Phase connections
- Orange animated = Task dependencies
- Gray = Phase-task links

---

### 9. Matrix View 📊 (NEW)
```
           PENDING  IN-PROG  COMPLETED  BLOCKED
         ┌────────┬────────┬──────────┬────────┐
Phase 0  │ T1 T2  │  T3    │  T4 T5   │        │
         ├────────┼────────┼──────────┼────────┤
Phase 1  │ T6     │  T7 T8 │  T9      │        │
         ├────────┼────────┼──────────┼────────┤
Phase 2  │ T10 T11│  T12   │  T13     │  T14   │
         ├────────┼────────┼──────────┼────────┤
Phase 3  │ T15    │  T16   │  T17 T18 │        │
         ├────────┼────────┼──────────┼────────┤
Phase 4  │ T19    │        │  T20     │        │
         ├────────┼────────┼──────────┼────────┤
Phase 5  │ T21 T22│  T23   │          │        │
         └────────┴────────┴──────────┴────────┘
```
**Use Case:** Distribution overview, workload balance
**Layout:** Grid with phases as rows, status as columns
**Special:** Easy to spot empty cells (bottlenecks)

---

## Quick Selection Guide

### Choose Based on Your Question:

**"How is the project structured?"**
→ Use **Hierarchical** or **Timeline**

**"What's the overall status?"**
→ Use **Matrix View** or **Swim Lanes**

**"How mature is the project?"**
→ Use **Radial Burst** (completed phases move inward)

**"How do phases evolve?"**
→ Use **Galaxy Spiral** or **Timeline**

**"What are the dependencies?"**
→ Use **Network Graph**

**"What's the natural organization?"**
→ Use **Organic Clusters**

**"What tasks are blocked/in-progress?"**
→ Use **Swim Lanes**

**"Where are the bottlenecks?"**
→ Use **Matrix View** (look for empty or overfull cells)

**"What looks coolest for a presentation?"**
→ Use **Galaxy Spiral**, **Radial Burst**, or **Network Graph**

---

## Layout Algorithm Complexity

| Layout | Algorithm | Complexity | Computation |
|--------|-----------|------------|-------------|
| Hierarchical | Geometric | O(n) | Instant |
| Timeline | Geometric | O(n) | Instant |
| Red Circular | Geometric | O(n) | Instant |
| Radial Burst | Geometric | O(n) | Instant |
| Galaxy Spiral | Geometric | O(n) | Instant |
| Swim Lanes | Geometric | O(n) | Instant |
| Matrix View | Geometric | O(n) | Instant |
| Organic Clusters | Physics (D3) | O(n²) | ~100ms |
| Network Graph | Physics (D3) | O(n²) | ~150ms |

**Legend:**
- O(n): Linear time, scales perfectly
- O(n²): Quadratic time, pre-computed (not real-time)

---

## Color Coding

### Phase Status Colors
- 🟢 **Completed**: Emerald gradient (green)
- 🟣 **In Progress**: Purple gradient + pulse
- ⚪ **Pending**: Gray gradient
- 🔴 **Blocked**: Red gradient

### Task Priority Borders
- 🔴 **P0**: Red border (Critical)
- 🟠 **P1**: Orange border (High)
- 🟡 **P2**: Yellow border (Medium)

### Edge Types
- 🟣 **Phase links**: Purple dashed (3px)
- 🟠 **Dependencies**: Orange animated (2px)
- ⚪ **Task links**: Gray subtle (1px)

---

**Pro Tip:** Use the keyboard to quickly switch layouts (future feature)

**Created:** 2026-01-25
