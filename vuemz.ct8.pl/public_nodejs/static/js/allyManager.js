class AllyManager {

    constructor() {
        this.allies = {}
    }

    newAlly(x, y, z, id, scene) {
        this.allies[id] = new Ally(x, y, z, scene)
    }

    getAllies() {
        return this.allies
    }

    tryFollow(player) {
        let keys = Object.keys(this.allies)
        let lastPlayer = player
        for (let i = 0; i < keys.length; i++) {
            const element = this.allies[keys[i]];
            element.tryFollow(lastPlayer)

            if (element.isFollowing()) lastPlayer = element


        }
    }

}