# Roll the dice

Real-time service to roll a virtual dice with 

## How to run it

- Install dependencies
```bash
$ yarn
# or
$ npm i
```

- Start the server
```bash
$ yarn dev
# or
$ npm run dev
```

## Usage

- Navigate to [`http://localhost:3000/`](http://localhost:3000/)
- Set your name
- Chooose create a new room or join to an existing one
- You will join as viewer, you can switch your status to player and everytime the owner roll the dice, your die will be rolled as well
- Only the owner of the room can roll the dice
- The latest die result will be displayed
- You can invite other people by sharing the link or scanning the qr code

## Logic explanation

### Actions

**`join`**: Everytime a new user enter in to the room, emit this event to register its name.

**`leave`**: When the connection is lost the player is removed from the players list. If the player is the owner, will pass the ownership to the second player in the list. If there's no left players, the room will be deleted.

**`switchPlayerStatus`**: This switch the player status between viewer and player. By default every user is joined as viewer. Only if the user is a player, his die will be rolled.

**`roll`**: This will roll the dice for all the users. If there aren't players, the die will not roll. This action is only available for the room owner.

### Events

**`playersUpdated`**: This event is emited when some data player changes

**`gameUpdated`**: This event is emited when the die is rolling

## FAQ

- **Why I'm using next.js**: Includes react and a built-in node server, so I didn't waste time with complex configurations
- **Why I'm using hook?**: Hooks is good way to encapsulate logic and make components more easy to read



> NOTE: Code includes some comments to explain some parts in detail
