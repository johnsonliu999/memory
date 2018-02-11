defmodule MemoryWeb.GamesChannel do
  use MemoryWeb, :channel

  alias Memory.Game
  alias Memory.GameBackup

  def join("games:" <> name, _payload, socket) do
    """
    if authorized?(payload) do
      {:ok, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
    """
    game = GameBackup.load(name) || Game.new()
    socket = socket |> assign(:name, name) |> assign(:game, game)
    GameBackup.save(name, game)
    {:ok, %{"jon" => name, "game" => game}, socket}
  end

  # return game state {game {tiles, clicks}, valid}
  def handle_in("guess", payload, socket) do
    game = socket.assigns[:game]
    IO.inspect payload
    %{"index1" => index1, "index2" => index2} = payload
    ret = Game.guess(game, index1, index2)
    socket = assign(socket, :game, ret["game"])
    GameBackup.save(socket.assigns[:name], ret["game"])
    {:reply, {:ok, ret}, socket}
  end

  def handle_in("restart", _payload, socket) do
    game = Game.new()
    socket = socket |> assign(:game, game)
    GameBackup.save(socket.assigns[:name], game)
    {:reply, {:ok, %{"game" => game}}, socket}
  end

  # Channels can be used in a request/response fashion
  # by sending replies to requests from the client
  def handle_in("ping", payload, socket) do
    {:reply, {:ok, payload}, socket}
  end

  # It is also common to receive messages from the client and
  # broadcast to everyone in the current topic (games:lobby).
  def handle_in("shout", payload, socket) do
    broadcast socket, "shout", payload
    {:noreply, socket}
  end

  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end
end
