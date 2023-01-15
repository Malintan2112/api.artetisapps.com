const politeName = (gender) => {
    let politeName = 'sdr/i '
    switch (gender) {
        case 'MEN':
            politeName = 'Bp '
            break;
        case 'WOMEN':
            politeName = 'Ibu '
            break;
        default:
            break;
    }
    return politeName
}

module.exports = {politeName}