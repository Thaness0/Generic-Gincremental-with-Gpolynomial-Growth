function sciFormat(decimal, precision = 2, showMantissa = true) {
    let exp = decimal.log10().floor()
    let man = decimal.div(Decimal.pow(10,exp))
    if (exp.gte(1e9)) {precision = 0; if (exp.gte(1e12)) showMantissa = false; exp = sciFormat(new Decimal(exp), 1)}
    return (showMantissa)? man.toStringWithDecimalPlaces(precision) + "e" + exp : "e" + exp
}

function format(decimal, precision = 2) {
    if (!isFinite(decimal.mag) || !isFinite(decimal.layer)) return "Infinity"
    else if (decimal.gte("1ee16")) return decimal.toStringWithDecimalPlaces(precision+1)
    else if (decimal.gte(1e7)) return sciFormat(decimal, precision)
    else if (decimal < 0.01) return decimal.toStringWithDecimalPlaces(0)
    else return decimal.toStringWithDecimalPlaces(precision)
}