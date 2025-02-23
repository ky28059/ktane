# Keep Typing and Nobody Explodes

## Inspiration

Inspired by Keep Talking And Nobody Explodes, two players must work together to finish their provided code samples—one controlling the editor, the other viewing the keybind documentation. Can you pass your test cases before your code is deployed to prod?

## What it does

Two players are connected through the lobby. One player gets the editor, the other gets the manual. Players must communicate effectively to pass all the test cases before the project gets deployed to production. There are three difficulties, easy, medium and hard. Each of which introduce new challenges like harder test cases, more convoluted keybinds, bigger distractions and stranger editor quirks.

## How we built it

- Frontend: Next.js
- Backend: Fastapi
- Test case runner: nsjail / Flask

## Challenges we ran into

The biggest challenge that we faced was developing the rule-keybinding system. It is setup as an abstract syntax tree and is dynamically generated based on the player's current level and the complexity of the coding task. The system needed to:
 - Ensure Logical Progression: Players start with simple keybinds (e.g., basic navigation) and gradually unlock more complex commands (e.g., multi-line edits, regex substitutions).
 - Handle Real-Time Lookups: Since the Guide must reference the keybindings, we structured them in a tree format that allows quick searching through a set of rules.

One of the toughest parts of this was ensuring the generated keybindings would still be an enjoyable experience for the players. For example keybinds to swtich mode that depended on a certain mode wouldn't work.

## Accomplishments that we're proud of

 - Dynamic Keybinding System: We implemented an AST-based rule system that generates rules and keybinds.
 - Seamless Multiplayer Experience: Our lobby ensures smooth player connections.
 - Secure Test Case Execution: By using nsjail, we safely execute and validate user code while preventing exploits.


## What's next for Keep Typing And Nobody Explodes

 - More Programming Languages: Expanding support beyond Python.
 - Custom Game Modes: Debugging-only rounds, AI-assisted coding, or memory-restricted challenges.
 - Randomized Editor Quirks: Introducing unique "glitches" per game to keep things unpredictable.
 - More modes and features for harder difficulties