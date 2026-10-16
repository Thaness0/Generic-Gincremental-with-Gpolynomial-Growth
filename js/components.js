lastUpdate = Date.now()
diff = 0
startState = {}
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
        perks: [],
        totalPerks: 4,
    },

    generators: [],
    keptGenerators: 0,

    currentTab: "mainTab",
    devSpeed: 1,
    lastSave: 0,
    autoSaveEnabled: true,
}

function initializeStartState() {
    startState = player
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

class perk {
    constructor() {
        this.name = "unnamed",
        this.bought = false,
        this.effect = new Decimal(1),
        this.cost = new Decimal(10),
        this.description = "undescribed"

    }

    canBuy() {
        return (player.empower.currency.gte(this.cost) && !this.bought)
    }

    buy() {
        if(this.canBuy()) {
            player.empower.currency = player.empower.currency.sub(this.cost)
            this.bought = true
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

function initializeEmpowerPerks() {
    let names = ["Empower Money", "Empower Generators", "Empower Prestige", "Empower Prestige Upgrades"]
    for (i=0;i<player.empower.totalPerks;i++) {
        let up = new perk(i)
        player.empower.perks.push(up)
        player.empower.perks[i].name = names[i]
    }
}

function resetGenerators(kept) {
    for(i=0;i<9;i++) {
        let g = player.generators[i]
        g.amount = new Decimal(0)
        if (!kept.gte(i+1)) {g.bought = new Decimal(0)}


    }

}


function DecimalConverter() {
    player.money = new Decimal(player.money)
    player.moneyGain = new Decimal(player.moneyGain)
    player.prestige.currency = new Decimal(player.prestige.currency)
    player.prestige.gain = new Decimal(player.prestige.gain)
    player.empower.currency = new Decimal(player.empower.currency)
    player.empower.gain = new Decimal(player.empower.currency)

    for (i=0;i<player.prestige.totalUpgrades;i++) {
        let loader = new upgrade()
        loader.bought = new Decimal(player.prestige.upgrades[i].bought)
        loader.effect = new Decimal(player.prestige.upgrades[i].effect)
        loader.cost = new Decimal(player.prestige.upgrades[i].cost)
        player.prestige.upgrades[i] = loader
    }

    for (i=0;i<player.empower.totalPerks;i++) {
        let loader = new perk()
        loader.effect = new Decimal(player.empower.perks[i].effect)
        loader.cost = new Decimal(player.empower.perks[i].cost)
        player.empower.perks[i] = loader
    }

    for (i=0;i<9;i++) {
        let loader = new generator()
        loader.bought = new Decimal(player.generators[i].bought)
        loader.amount = new Decimal(player.generators[i].amount)
        loader.cost = new Decimal(player.generators[i].cost)
        loader.generation = new Decimal(player.generators[i].generation)
        player.generators[i] = loader
    }

}

function save() {
	localStorage.setItem("gipg", JSON.stringify(player))
    player.lastSave = 0
}

function load() {
	let s = localStorage.getItem("gipg");
	if (s === null||s === undefined) return
	player = JSON.parse(s)
    DecimalConverter()
    player.currentTab = "mainTab"
}

function reset() {
    if (confirm("Are you sure you want to reset?")){
        localStorage.setItem("gipg", JSON.stringify(startState))
        window.location.reload()
    }
}

function buttonLoad() {
    if (confirm("Are you sure you want to load an earlier save?")){
        load()
        window.location.reload()
    }
}

function saveTimer(diff) {
    player.lastSave += 1 * diff
    if (player.lastSave >= 30 && player.autoSaveEnabled) {
        save()
    }
}

function changeAutoSave() {
    player.autoSaveEnabled = !(player.autoSaveEnabled)
}