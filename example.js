const defiSdk = require('defi-sdk').client

const ADDRESS = "0x42b9dF65B219B3dD36FF330A4dD8f327A6Ada990"

defiSdk.configure({
    url: 'wss://api-v4.zerion.io/',
    apiToken: 'Demo.ukEVQp6L5vfgxcz4sBke7XvS873GMYHy'
})

// Address
console.table([
    {
        address: ADDRESS
    }
])

// Get address assets
defiSdk.addressAssets({
    payload: {
        address: ADDRESS
    },
    onData: data => {
        let assets = Object.values(data.assets)
            .map(addressAsset => {
                const { quantity, asset } = addressAsset;
                const commonQuantity = (
                    Number(quantity) *
                    10 ** (0 - asset.decimals)
                ).toFixed(2);
                const price = asset.price
                    ? `${new Intl.NumberFormat("en", {
                        style: "currency",
                        currency: "usd",
                    }).format(asset.price.value)}`
                    : "—";
                const value = asset.price ? commonQuantity*asset.price.value : null
                const printableValue = (value !== null) ? `${new Intl.NumberFormat("en", {
                    style: "currency",
                    currency: "usd",
                }).format(value)}` : '-'
                return {
                    name: asset.name,
                    symbol: asset.symbol,
                    quantity: commonQuantity,
                    price: price,
                    value: value,
                    pValue: printableValue
                }
            }).filter(portfolioAsset => {
                return portfolioAsset.value > 1
            }).sort(function(a,b) {
                return b.value - a.value;
            }).map(portfolioAsset => {
                return {
                    name: portfolioAsset.name,
                    symbol: portfolioAsset.symbol,
                    quantity: portfolioAsset.quantity,
                    price: portfolioAsset. price,
                    value: portfolioAsset.pValue
                }
            })
        console.table(assets);
}
});

// Get address loans
defiSdk.addressLoans({
    payload: {
        address: ADDRESS
    },
    onData: data => {
        let loans = Object.values(data.loans)
            .map(addressLoan => {
                const price = addressLoan.asset.price
                    ? `${new Intl.NumberFormat("en", {
                        style: "currency",
                        currency: "usd",
                    }).format(addressLoan.asset.price.value)}`
                    : "—";
                const printableValue = (addressLoan.value !== null) ? `${new Intl.NumberFormat("en", {
                    style: "currency",
                    currency: "usd",
                }).format(addressLoan.value)}` : '-'
                return {
                    protocol: addressLoan.protocol,
                    position: addressLoan.section,
                    name: addressLoan.asset.name,
                    symbol: addressLoan.asset.symbol,
                    quantity: addressLoan.borrowed,
                    price: price,
                    value: addressLoan.value,
                    pValue: printableValue
                }
            }).sort(function(a,b) {
                return b.value - a.value;
            }).map(portfolioLoan => {
                return {
                    protocol: portfolioLoan.protocol,
                    position: portfolioLoan.section,
                    name: portfolioLoan.name,
                    symbol: portfolioLoan.symbol,
                    quantity: portfolioLoan.quantity,
                    price: portfolioLoan.price,
                    value: portfolioLoan.pValue
                }
            })
        console.table(loans);
    }
});

// TODO: Get address history



