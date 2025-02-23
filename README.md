![Keep Typing and Nobody Explodes](https://github.com/user-attachments/assets/b82952ad-9fd4-4d8f-a575-78449811932a)

## Inspiration

Inspired by Keep Talking And Nobody Explodes, two players must work together to finish their provided code samples—one controlling the editor, the other viewing the keybind documentation. Can you pass your test cases before your code is deployed to prod?

## What it does

![landing](https://github.com/user-attachments/assets/14efe995-19d8-4840-a5e6-aa7bc284da51)

Two players are connected through the lobby. One player gets the editor, the other gets the manual. Players must communicate effectively to pass all the test cases before the project gets deployed to production. There are three difficulties, easy, medium and hard. Each of which introduce new challenges like harder test cases, more convoluted keybinds, bigger distractions and stranger editor quirks.

## How we built it

- Frontend: Next.js
- Backend: Fastapi
- Test case runner: nsjail / Flask

## Challenges we ran into

![final](https://github.com/user-attachments/assets/49e5d820-bacf-4d95-830b-2c50ae1c98df)

The biggest challenge that we faced was developing the rule-keybinding system. It is setup as an abstract syntax tree and is dynamically generated based on the player's current level and the complexity of the coding task. The system needed to:
 - Ensure logical progression by making players start with simple keybinds (e.g., basic navigation) and gradually unlock more complex commands (e.g., multi-line edits, regex substitutions).
 - Since the editor must dynamically apply keybindings, we structured them in a tree format that allows quick searching through a set of rules.

One of the toughest parts of this was ensuring the generated keybindings would still be an enjoyable experience for the players. For example keybinds to swtich mode that depended on a certain mode wouldn't work.

## Accomplishments that we're proud of

![manual1](https://github.com/user-attachments/assets/ee470665-2f74-4d26-94a6-a45c10863ab9)

 - We implemented a dynamic and expressive AST-based rule system that generates rules and keybinds.
 - Secure test case execution via nsjail to safely execute and validate user code while preventing exploits.


## What's next for Keep Typing And Nobody Explodes

 - Expanding programming language support beyond Python.
 - Debugging-only rounds, AI-assisted coding, or memory-restricted challenges.
 - Introducing unique "glitches" per game to keep things unpredictable.
 - More modes and features for harder difficulties
