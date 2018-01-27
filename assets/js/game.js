import React, {Component} from 'react';
import ReactDOM from 'react-dom';

export default function run_game(root) {
  ReactDOM.render(<Game />, root);
  console.log("Hello World");
};

const Tile = ({value, complete, onClick, show}) =>
  (<button className={"tile " + (complete ? "bg-success" : "")} onClick={onClick}>
    {complete || show ? value : ' '}
  </button>);

const Board = ({tiles, onClick}) => {

  const disp = [];

  for (let i = 0; i < tiles.length; i++) {
    disp.push(<Tile key={i} className={"col"}
                {...tiles[i]}
                onClick={() => onClick(i)} />);
    if (i % 4 == 3)
      disp.push(<div key={"b"+i} className={"w-100"}></div>);
  }

  return (<div className={"board"}>
            <div className={"row"}>
              {disp}
            </div>
          </div>);
};


class Game extends Component {
  constructor(props) {
    super(props);

    const tiles = this.genTiles();

    // state[object] : {tiles: array[tile], count: integer, lastIndex: integer}
    // tile[object] : {value: string, complete: boolean}
    this.state = {
      tiles,
      valid: true, // if the click happends in invalid time, no response
      lastIndex: -1, // last try index
      count: 0, // the times of try
      clicks: 0, // clicks
      status: false // game state
    }

    this.handleClick = this.handleClick.bind(this);
  }

  restart = () => {
    const tiles = this.genTiles();

    this.setState(
      {
        tiles,
        valid: true, // if the click happends in invalid time, no response
        lastIndex: -1, // last try index
        count: 0, // the times of try
        clicks: 0,
        status: false // game state
      }
    );
  }

  // return : array[tile]
  genTiles = () => {
    let alps = _.range(8);
    alps = alps.concat(alps);
    alps = _.shuffle(alps);
    return alps.map(
        i => ({
          value: String.fromCharCode('A'.charCodeAt(0)+i),
          complete: false,
          show: false
      }));
  }

  handleClick(i) {

    console.log(i);


    let {tiles, lastIndex, valid, count, clicks} = this.state;
    if (tiles[i].complete) return; // already complete

    if (!valid) return; // invalid time Click

    const curTiles = tiles.slice(); // copy
    if (count === 0) { // first try
      const lastIndex = i;
      curTiles[i].show = true;
      clicks += 1;
      this.setState({...this.state, tiles:curTiles, lastIndex: i, clicks, count: 1});

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
        clicks += 1;
        this.setState({...this.state, tiles: curTiles, status, clicks, count: 0});

      } else {
        // mismatch
        // 1. mark curent tile show for 1s
        // 2. invalidate the whole game for 1s
        // 3. after 1s hide both tiles and validate the game
        curTiles[i].show = true;
        clicks += 1;
        this.setState({...this.state, tiles: curTiles, valid: false, count: 0, clicks});

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
      <div>
        <Board tiles={this.state.tiles} onClick ={this.handleClick} />
        <div>
          <div>Clicks : {this.state.clicks}</div>
          <div>
            Score : {Math.round(1600/this.state.clicks)}
          </div>
        </div>
        <button type="button" className={"btn btn-primary"} onClick={this.restart}>
          {"Restart"}
        </button>
      </div>
    );
  }
}
