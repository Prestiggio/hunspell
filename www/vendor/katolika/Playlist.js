export class Playlist
{
    #name
    #index = -1
    #items = []

    constructor(name) {
        this.#name = name
    }

    append(item) {
        this.#items.push(item)
    }

    next() {
        if(this.#items.length-1>this.#index) {
            this.#index++
            return this.#items[this.#index]
        }
    }

    getItems() {
        return this.#items
    }
}

const PLAYING = new Playlist('main_playlist')

export default PLAYING