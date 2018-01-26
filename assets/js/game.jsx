import React, {Component} from 'react';
import ReactDOM from 'react-dom';

export default function run_game(root) {
  ReactDOM.render(<Game />, root);
  console.log("Hello World");
};

const Tile = ({value, complete, onClick, show}) =>
  (<button className={"tile"} onClick={onClick}>
    {complete || show ? value : ' '}
  </button>);

const Board = ({tiles, onClick}) =>
  (<div className={"board"}>
    <div className={"board-row"}>
      <Tile
        {...tiles[0]}
        onClick={() => onClick(0)} />
      <Tile
        {...tiles[1]}
        onClick={() => onClick(1)} />
    </div>
    <div className={"board-row"}>
      <Tile
        {...tiles[2]}
        onClick={() => onClick(2)} />
      <Tile
        {...tiles[3]}
        onClick={() => onClick(3)} />
    </div>
  </div>);

class Game extends Component {
  constructor(props) {
    super(props);
    // state[object] : {tiles: array[tile], count: integer, lastIndex: integer}
    // tile[object] : {value: string, complete: boolean}
    this.state = {
      tiles: [
        {value: 'A', complete: false, show: false},
        {value: 'B', complete: false, show: false},
        {value: 'A', complete: false, show: false},
        {value: 'B', complete: false, show: false}
      ],
      valid: true, // if the click happends in invalid time, no response
      lastIndex: -1, // last try index
      count: 0, // the times of try
      score: 0, //
      status: false // game state
    }

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(i) {

    console.log(i);


    let {tiles, lastIndex, valid, count} = this.state;
    if (tiles[i].complete) return; // already complete

    if (!valid) return; // invalid time Click

    const curTiles = tiles.slice(); // copy
    if (count === 0) { // first try
      const lastIndex = i;
      curTiles[i].show = true;
      this.setState({...this.state, tiles:curTiles, lastIndex: i, count: 1});

    } else { // second try
      if (lastIndex === i) return; // try the same tile

      if (tiles[lastIndex].value === tiles[i].value) {
        // match
        // 1. mark both as complete
        // 2. show both tiles
        curTiles[lastIndex].complete = true;
        curTiles[lastIndex].show = true;
        curTiles[i].complete = true;
        curTiles[i].show = true;
        status = curTiles.every(tile => tile.complete);
        this.setState({...this.state, tiles: curTiles, status, count: 0});

      } else {
        // mismatch
        // 1. mark curent tile show for 1s
        // 2. invalidate the whole game for 1s
        // 3. after 1s hide both tiles and validate the game
        curTiles[i].show = true;
        this.setState({...this.state, tiles: curTiles, valid: false, count: 0});

        // after 1s
        setTimeout(() => {
          const curTiles = this.state.tiles.slice();
          curTiles[i].show = false;
          curTiles[lastIndex].show = false;

          this.setState({...this.state, curTiles, valid: true});
        }, 1000);
      }

    }
  };

  render() {
    return (
      <Board tiles={this.state.tiles} onClick ={this.handleClick} />
    );
  }
}
