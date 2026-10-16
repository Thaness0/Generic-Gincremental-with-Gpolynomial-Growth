function updateGenerators(diff) {
    for(i=0;i<9;i++) {
        let g = player.generators[i]

        let newCost = new Decimal(10).mul(new Decimal(i).add(3).pow(g.bought.add(i*i)))
            newCost = newCost.div(player.prestige.upgrades[3].effect)
            //add cost changes here
        g.cost = newCost
        let genGain = g.total().mul(g.bought)
        if (i != 0)genGain = genGain.mul(player.prestige.upgrades[1].effect).mul(player.empower.perks[1].effect)


        g.generation = genGain
        if (i != 0) {
            player.generators[(i-1)].amount = player.generators[(i-1)].amount.add(g.generation.mul(diff))
        }
    }
}

function updateUpgrades() {
    let ups = []
    for (i=0;i<player.prestige.totalUpgrades;i++) {
        let u = player.prestige.upgrades[i]
        ups.push(u)
    }
    //Money Boost
    ups[0].cost = new Decimal(2).pow(ups[0].bought).mul(0.5)
    ups[0].effect = ups[0].bought.mul(2).pow(1.4).add(1)
    ups[0].description = "<br> increases money gain by <b>X"
    //Generator Boost
    ups[1].cost = new Decimal(3).pow(ups[1].bought).mul(0.5)
    ups[1].effect = ups[1].bought.div(8).add(1)
    ups[1].description = "<br> increases generator gain by <b>X"
    //Prestige Boost
    ups[2].cost = new Decimal(4).pow(ups[2].bought).mul(0.25)
    ups[2].effect = ups[2].bought.div(5).add(1).pow(1.6)
    ups[2].description = "<br> increases prestige gain by <b>X"
    //Cost Reducer
    ups[3].cost = new Decimal(3).pow(ups[3].bought)
    ups[3].effect = ups[3].bought.add(1).pow(2)
    ups[3].description = "<br>reduces the cost of generators by <b>/"
    //Money Boost 2
    ups[4].cost = new Decimal(2).pow(ups[4].bought.mul(1.25)).mul(5)
    ups[4].effect = ups[4].bought.mul(1.5).pow(1.4).add(1)
    ups[4].description = "<br> increases money gain by another <b>X"
    //Prestige Upgrade Boost
    ups[5].cost = new Decimal(5).pow(ups[5].bought.mul(1.5).add(1))
    ups[5].effect = ups[5].bought.div(10).add(1)
    ups[5].description = "<br> increases power of first 5 prestige upgrades by <b>X"
    //Generator Keeper
    ups[6].cost = new Decimal(10).pow(ups[6].bought.add(1))
    ups[6].effect = ups[6].bought
    ups[6].description = "<br> increases generators kept (1 -> 9) <b>Keep "
    //Prestige Boost 2
    ups[7].cost = new Decimal(4).pow(ups[7].bought)
    ups[7].effect = ups[7].bought.div(10).add(1)
    ups[7].description = "<br> increases prestige gain by another <b>X"
    //Money Boost 3
    ups[8].cost = ups[8].bought.add(1).mul(20).pow(5)
    ups[8].effect = ups[8].bought.div(50).add(1)
    ups[8].description = "<br> increases money gain by <b>^"

    for (i=0;i<5;i++) {
        ups[i].effect = ups[i].effect.mul(ups[5].effect).mul(player.empower.perks[3].effect)
    }
}

function updatePerks() {
    let pks = []
    for (i=0;i<player.empower.totalPerks;i++) {
        let p = player.empower.perks[i]
        pks.push(p)
    }
    //Empower Money
    pks[0].cost = new Decimal(10)
    pks[0].effect = (pks[0].bought)? new Decimal(5).mul(player.empower.currency).sqrt() : new Decimal(1)
    pks[0].description = "<br> empowers money gain by <b>X"
    //Empower Generators
    pks[1].cost = new Decimal(50)
    pks[1].effect = (pks[1].bought)? new Decimal(2).mul(player.empower.currency).sqrt() : new Decimal(1)
    pks[1].description = "<br> empowers generator gain by <b>X"
    //Empower Prestige
    pks[2].cost = new Decimal(200)
    pks[2].effect = (pks[2].bought)? new Decimal(1.5).mul(player.empower.currency).sqrt() : new Decimal(1)
    pks[2].description = "<br> empowers prestige gain by <b>X"
    //Empower Prestige Upgrades
    pks[3].cost = new Decimal(1000)
    pks[3].effect = (pks[3].bought)? new Decimal(0.5).mul(player.empower.currency).sqrt() : new Decimal(1)
    pks[3].description = "<br> empowers first 5 prestige upgrades by <b>X"

   
}

function productionLoop(diff) {
    let gain = player.generators[0].generation
    gain = gain.mul(player.prestige.upgrades[0].effect)
    gain = gain.mul(player.prestige.upgrades[4].effect)
    gain = gain.pow(player.prestige.upgrades[8].effect)

    player.moneyGain = gain
    player.money = player.money.add(player.moneyGain.mul(new Decimal(diff)))

    let newprestigeGain = player.money.add(1).log10().pow(1.2)
    newprestigeGain = newprestigeGain.mul(player.prestige.upgrades[2].effect)
    newprestigeGain = newprestigeGain.mul(player.prestige.upgrades[7].effect)
    newprestigeGain = newprestigeGain.mul(player.empower.perks[2].effect)

    player.prestige.gain = newprestigeGain

    let newEmpowerGain = player.generators[0].total().add(1).log10().pow(1.1)

    player.empower.gain = newEmpowerGain
}


function prestige() {
    if (player.money.gte(1e10)) {
        player.prestige.hasPrestiged = true
        player.prestige.currency = player.prestige.currency.add(player.prestige.gain)
        resetGenerators(player.prestige.upgrades[6].effect)
        player.money = new Decimal(10)
    }
}

function empowerPrestige() {
    if (player.generators[0].total().gte(1e11)) {
        player.empower.hasPrestiged = true
        player.empower.currency = player.empower.currency.add(player.empower.gain)
        resetGenerators(player.prestige.upgrades[6].effect)
        player.money = new Decimal(10)

    }
}



function updateGUI() {
    document.getElementById("moneyTracker").textContent = "$" + format(player.money) + " (" + format(player.moneyGain) + "/s)"
    document.getElementById("saveTimerTracker").textContent = "Last save was: " + player.lastSave.toFixed(1) + " seconds ago" 
    document.getElementById("prestigeTracker").textContent = (player.prestige.hasPrestiged)? "✧" + format(player.prestige.currency) : ""
    document.getElementById("empowerTracker").textContent = (player.empower.hasPrestiged)? "∅" + format(player.empower.currency) : ""
    document.getElementById("prestigeButtonInfo").innerHTML = "prestige for ✧" + format(player.prestige.gain) + "<br>(resets $ & generators)"
    document.getElementById("prestigeButtonInfo").style.opacity = (player.money.gte(1e10))? "100%" : (player.prestige.hasPrestiged)? "50%" : "0%"
    document.getElementById("empowerButtonInfo").innerHTML = "reset for ∅" + format(player.empower.gain) + "<br>(resets $ & generators)"
    document.getElementById("empowerButtonInfo").style.opacity = (player.generators[0].total().gte(1e11))? "100%" : (player.empower.hasPrestiged)? "50%" : "0%"
    document.getElementById("empowermentInfo").style.opacity = (player.empower.hasPrestiged)? "100%" : "0%"
    document.getElementById("autoSaveButton").textContent = "Auto save: " + ((player.autoSaveEnabled)? "On" : "Off")

    for(i=0;i<9;i++) {
        let g = player.generators[i]
        let gainDisplay = (i != 8)? " (" + format(player.generators[(i+1)].generation) + "/s)" : ""
        document.getElementById("generatorTracker" + i).textContent = "Generator " + (1+i) + " | cost: " + format(g.cost) + " | Gain: " + format(g.total()) + gainDisplay + " X " + format(g.bought)
    }

    for(i=0;i<player.prestige.totalUpgrades;i++) {
        let u = player.prestige.upgrades[i]
        document.getElementById("prestigeUpgrade" + i).innerHTML = u.name + u.description + format(u.effect) + "<br>Cost: ✧" + format(u.cost) + "</b>"
        document.getElementById("prestigeUpgrade" + i).style.opacity = (player.prestige.hasPrestiged)? "100%" : "0%"
    }

    for(i=0;i<player.empower.totalPerks;i++) {
        let p = player.empower.perks[i]
        document.getElementById("empowerPerk" + i).innerHTML = p.name + p.description + format(p.effect) + "<br>Cost: ∅" + format(p.cost) + "</b>"
        document.getElementById("empowerPerk" + i).style.opacity = (player.empower.hasPrestiged)? "100%" : "0%"
        document.getElementById("empowerPerk" + i).style.backgroundColor = (p.bought)? "var(--palette-add-dark-pink" : "var(--palette-add-black"
    }
}

function mainLoop() {
    diff = (Date.now() - lastUpdate) / 1000
    saveTimer(diff)
    diff *= player.devSpeed

    updateUpgrades()
    updatePerks()
    updateGenerators(diff)
    productionLoop(diff)
    updateGUI()
    

    lastUpdate = Date.now()
}

setInterval(mainLoop, 50)

initializeStartState()
initializeEmpowerPerks()
initializePrestigeUpgrades()
initializeGenerators()
load()
updateGUI()