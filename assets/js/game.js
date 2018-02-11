import React, {Component} from 'react';
import ReactDOM from 'react-dom';

export default function run_game(root, channel) {
  ReactDOM.render(<Game channel={channel}/>, root);
  console.log("Hello World");
};

const Tile = ({value, complete, onClick, show}) =>
  (<button className={"tile " + (complete ? "bg-success" : "")} onClick={onClick}>
    {complete || show ? value : ' '}
  </button>);

const Board = ({tiles, onClick, shows}) => {

  const disp = [];

  for (let i = 0; i < tiles.length; i++) {
    disp.push(<Tile key={i} className={"col"}
                {...tiles[i]}
                onClick={() => onClick(i)}
                show={shows[i]}/>);
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

    props.channel.join()
      .receive("ok", resp => {
        let {game:{tiles, clicks}} = resp;
        this.setState(Object.assign({}, this.state, {tiles, clicks}));
      })
      .receive("error", resp=>{console.log("Unable to Join", resp)});

    // state[object] : {tiles: array[tile], count: integer, lastIndex: integer}
    // tile[object] : {value: string, complete: boolean}
    this.state = {
      tiles : null, // {val, complete}
      valid: true, // if the click happends in invalid time, no response
      lastIndex: -1, // last try index
      clicks: 0, // clicks
      shows: new Array(16).fill(false)
    }

    this.handleClick = this.handleClick.bind(this);
  }

  restart() {
    this.props.channel.push("restart", {})
      .receive("ok", resp => {
        let {game:{tiles, clicks}} = resp;
        this.setState(Object.assign({}, this.state, {tiles, clicks}));
      });

    this.setState(
      {
        tiles : null,
        valid: true, // if the click happends in invalid time, no response
        lastIndex: -1, // last try index
        clicks: 0,
        shows: new Array(16).fill(false)
      }
    );
  }

  handleClick(i) {

    console.log(i);

    let {tiles, lastIndex, valid, clicks, shows} = this.state;
    if (tiles[i].complete) return; // already complete

    if (!valid) return; // invalid time Click

    const curTiles = tiles.slice(); // copy
    if (lastIndex == -1) { // first try
      const lastIndex = i;
      shows[i] = true;
      clicks += 1;
      this.setState(Object.assign({}, this.state, {lastIndex: i, clicks, shows}));

    } else { // second try
      if (lastIndex === i) return; // try the same tile

      clicks += 1;
      shows[i] = true;
      this.setState(Object.assign({}, this.state,
        {clicks, shows, valid:false}));

      // channel
      this.props.channel.push("guess", {index1 : lastIndex, index2 : i})
        .receive("ok", resp => {
          console.log("resp:", resp);
          let {game:{tiles, clicks}, valid} = resp;
          if (!valid) {
            setTimeout(() => {
              this.setState(Object.assign({}, this.state,
                {valid:true, shows: new Array(16).fill(false)}))
              }, 1000);
          }

          this.setState(Object.assign({}, this.state,
            {tiles, clicks, valid, lastIndex: -1}));

        });
    }
  };

  render() {
    return (this.state.tiles ?
      (<div>
        <Board
          tiles={this.state.tiles}
          shows = {this.state.shows}
          onClick ={this.handleClick} />
        <div>
          <div>Clicks : {this.state.clicks}</div>
          <div>
            Score : {Math.round(1600/this.state.clicks)}
          </div>
        </div>
        <button type="button" className={"btn btn-primary"} onClick={this.restart.bind(this)}>
          {"Restart"}
        </button>
      </div>) : <div>Loading ...</div>);
  }
}
