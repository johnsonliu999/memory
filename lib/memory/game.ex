defmodule Memory.Game do
  def new do
      tiles = "AABBCCDDEEFFGGHH"
        |> String.graphemes
        |> Enum.shuffle
        |> Enum.map(&(%{"value" => &1, "complete" => false}))
      %{"tiles" => tiles, "clicks" => 0}
  end

  def guess(game, index1, index2) do
    %{"tiles" => tiles, "clicks" => clicks} = game
    tiles = tiles |> List.to_tuple
    t1 = elem(tiles, index1)
    t2 = elem(tiles, index2)
    IO.inspect t1, label: "t1"
    IO.inspect t2, label: "t2"
    game = game |> Map.put("clicks", clicks+2)
    if t1["value"] === t2["value"] do
      tiles = tiles
        |> put_elem(index1, %{t1 | "complete" => true})
        |> put_elem(index2, %{t2 | "complete" => true})
        |> Tuple.to_list
      game = game |> Map.put("tiles", tiles)
      %{"game" => game} |> Map.put("valid", true)
    else
      %{"game" => game} |> Map.put("valid", false)
    end
  end
end
