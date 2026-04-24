---
name: focus-ring-color
description: System-wide focus ring is BLUE (info color), never red. --ring token must use info hue.
type: design
---
The system-wide focus ring (`--ring` and `--sidebar-ring` tokens in `src/index.css`) MUST use the blue info color (HSL `207 85% 50%`), NOT the red primary color. This applies to both light and dark mode.

User has repeatedly insisted that focus rings, select open states, and input focus states across the entire system must be blue, never red. Do NOT revert `--ring` to the red `0 78% 55%` value under any circumstance.
