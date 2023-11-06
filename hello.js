class Produkt {
    constructor(id, nazwa, model, rokPordukcji, cena, zuzycieEnergii) {
        this.id=id;
        this.nazwa=nazwa;
        this.model=model;
        this.rokProdukcji=rokPordukcji;
        this.cena=cena;
        this.zuzycieEnergii=zuzycieEnergii;
    }

    koszt() {
        return this.cena;
    }

    kosztEnergii() {
        return this.zuzycieEnergii*cenaEnergii;
    }

    wiekProduktu() {
        const currentDate=new Date();
        return currentDate.getFullYear()-this.rokProdukcji;
    }

    wiekProduktuLata() {
        const wiek=this.wiekProduktu();
        return wiek + " " + (wiek===1?"rok":"lata");
    }
}

class ListaTowarow {
    constructor() {
        this.produkty=[];
    }

    wypiszProdukt(idProduktu) {
        const produkt = this.produkty.find((p)=>p.id===idProduktu);
        if(produkt) {
            return `ID: ${produkt.id}, Nazwa: ${produkt.nazwa}, Model: ${produkt.model}, Cena: ${produkt.cena}`;
        } else {
            return 'Produkt o podanym id nie został znaleziony.';
        }
    }

    wypiszWszystkieProdukty() {
        let result = "Lista produktów: \n";
        this.produkty.forEach((produkt)=>{
            result+=`ID: ${produkt.id}, Nazwa: ${produkt.nazwa}, Model: ${produkt.model}, Cena: ${produkt.cena}\n`;
        });
        return result;
    }

    dodajProdukt(produkt) {
        if(this.produkty.some((p)=>p.id===produkt.id)) {
            throw new Error("Produkt o podanym ID już istnieje.");
        }
        this.produkty.push(produkt);
    }

    zamienProdukt(idProduktu, nowyProdukt) {
        const index=this.produkty.findIndex((p)=>p.id===idProduktu);
        if(index!==-1) {
            this.produkty[index]=nowyProdukt;
        }
    }
}

class Magazyn extends ListaTowarow {
    constructor() {
        super();
        this.stanMagazynowy={};
    }

    dodajProdukt(produkt, ilosc) {
        if(this.stanMagazynowy[produkt.id]) {
            this.stanMagazynowy[produkt.id]+=ilosc;
        } else {
            this.stanMagazynowy[produkt.id]=ilosc;
        }
        super.dodajProdukt(produkt);
    }

    zabierzProdukt(idProduktu, ilosc) {
        if(this.stanMagazynowy[idProduktu] && this.stanMagazynowy[idProduktu]>=ilosc) {
            this.stanMagazynowy[idProduktu]-=ilosc;
            const produkt=this.produkty.find((p)=>p.id===idProduktu);
            if(produkt) {
                const kopiaProduktu=new Produkt(
                    produkt.id,
                    produkt.nazwa,
                    produkt.model,
                    produkt.rokProdukcji,
                    produkt.cena,
                    produkt.zuzycieEnergii
                );
                return kopiaProduktu;
            }
        }
    }
}

class Sklep extends ListaTowarow {
    constructor() {
        super();
    }

    dodajProdukt(nazwa, model, cena, zuzycieEnergii) {
        const id=this.produkty.length+1;
        const rokProdukcji=new Date().getFullYear();
        const produkt=new Produkt(id, nazwa, model, rokProdukcji, cena, zuzycieEnergii);
        super.dodajProdukt(produkt);
        return produkt;
    }

    dodajProdukt(idProduktu, nazwa, model, cena, zuzycieEnergii) {
        const rokProdukcji = new Date().getFullYear();
        const produkt = new Produkt(idProduktu, nazwa, model, rokProdukcji, cena, zuzycieEnergii);
        super.dodajProdukt(produkt);
        return produkt;
    }

    zlozZamowienie(idProduktu, ilosc, magazyn) {
        const produkt=this.produkty.find((p)=>p.id===idProduktu);
        if(produkt) {
            const kopiaProduktu = magazyn.zabierzProdukt(idProduktu, ilosc);
            if(kopiaProduktu) {
                return kopiaProduktu;
            }
        }
        return null;
    }
}

const magazyn = new Magazyn();
const sklep = new Sklep();

// Dodajmy kilka produktów do magazynu
const produkt1 = new Produkt(1, "Laptop", "Dell", 2022, 2000, 0.1);
const produkt2 = new Produkt(2, "Smartfon", "Samsung", 2021, 800, 0.05);
const produkt3 = new Produkt(3, "Telewizor", "Sony", 2020, 1500, 0.2);

magazyn.dodajProdukt(produkt1, 10);
magazyn.dodajProdukt(produkt2, 20);
magazyn.dodajProdukt(produkt3, 5);

// Wyświetl listę produktów w magazynie
console.log("Produkty w magazynie:");
console.log(magazyn.wypiszWszystkieProdukty());

// Dodajmy produkty do sklepu
const produkt4 = sklep.dodajProdukt("Monitor", "Asus", 500, 0.15);
const produkt5 = sklep.dodajProdukt(6, "Klawiatura", "Logitech", 100, 0.05);

// Wyświetl listę produktów w sklepie
console.log("Produkty w sklepie:");
console.log(sklep.wypiszWszystkieProdukty());

// Złóż zamówienie z magazynu do sklepu
const zamowienie = sklep.zlozZamowienie(2, 3, magazyn);

if (zamowienie) {
    console.log("Zamówienie zostało zrealizowane:");
    console.log(zamowienie);
} else {
    console.log("Zamówienie nie może zostać zrealizowane.");
}