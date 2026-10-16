lastUpdate = Date.now()
diff = 0

player = {
    money: new Decimal(20),
    moneyGain: new Decimal(1),

    prestige: {
        currency: new Decimal(0),
        gain: new Decimal(0),
        hasPrestiged: false,
        upgrades: [],
        totalUpgrades: 9,
    },

    empower: {
        currency: new Decimal(0),
        gain: new Decimal(0),
        hasPrestiged: false,
    },

    generators: [],
    keptGenerators: 0,

    currentTab: "mainTab",
}


function changeTab(tabId) {
    document.getElementById(player.currentTab).style.display = "none"
    document.getElementById(tabId).style.display = "block"
    player.currentTab = tabId
}

class generator {
    constructor(){
        this.bought = new Decimal(0),
        this.amount = new Decimal(0),
        this.cost = new Decimal(10),
        this.generation = new Decimal(0)

    }

    canBuy() {
        return player.money.gte(this.cost)
    }

    buy() {
        if(this.canBuy()) {
            player.money = player.money.sub(this.cost)
            this.bought = this.bought.add(1)
        }
    }

    total() {
        return this.bought.add(this.amount)
    }

}

class upgrade {
    constructor() {
        this.name = "unnamed",
        this.bought = new Decimal(0),
        this.effect = new Decimal(1),
        this.cost = new Decimal(10),
        this.description = "undescribed"

    }

    canBuy() {
        return (player.prestige.currency.gte(this.cost))
    }

    buy() {
        if(this.canBuy()) {
            player.prestige.currency = player.prestige.currency.sub(this.cost)
            this.bought = this.bought.add(1)
        }
    }
}


function initializeGenerators() {
    for (i=0;i<9;i++) {
        let gen = new generator(i)
        player.generators.push(gen)
    }
    player.generators[0].bought = new Decimal(1)
}

function initializePrestigeUpgrades() {
    let names = ["Money Boost", "Generator Boost", "Prestige Boost", "Cost Reducer", "Money Boost 2", "Prestige Upgrade Boost", "Generator Keeper", "Prestige Boost 2", "Money Boost 3"]
    for (i=0;i<player.prestige.totalUpgrades;i++) {
        let up = new upgrade(i)
        player.prestige.upgrades.push(up)
        player.prestige.upgrades[i].name = names[i]
    }
}

function resetGenerators(kept) {
    for(i=0;i<9;i++) {
        let g = player.generators[i]
        g.amount = new Decimal(0)
        if (!kept.gte(i+1)) {g.bought = new Decimal(0)}


    }

}