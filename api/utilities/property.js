function priceToStr(price){
    const cr = 10000000;
    const lac = 100000;
    if(price/cr >= 1){
        return price/cr + " Cr";
    }else if(price/lac >= 1){
        return price/lac + " L";
    }else{
        return price/1000 + ",000";
    }
}

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}

const getOnSaleProperty = (properties) => {
    const toReturn = {};
    toReturn['count'] = properties.length;
    toReturn['data'] = [];
    properties.forEach(property => {
        const prop = {};
        prop['id'] = property.property_id;
        prop['name'] = property.property_name;
        prop['bedrooms'] = property.no_of_bedroom;
        prop['bathrooms'] = property.no_of_bathroom;
        prop['balconies'] = property.no_of_balcony;
        prop['size'] = property.size + " sq. ft.";
        prop['price'] = property.price;
        prop['priceString'] = priceToStr(property.price);
        prop['category'] = property.category;
        prop['address'] = property.street_number + " " + property.street_name + ", " + property.city;
        prop['img'] = property.property_img1;
        toReturn['data'].push(prop);
    });
    return toReturn;
};

const getSoldProperty = (properties) => {
    const toReturn = {};
    toReturn['count'] = properties.length;
    toReturn['data'] = [];
    properties.forEach(property => {
        const prop = {};
        prop['id'] = property.property_id;
        prop['name'] = property.property_name;
        prop['bedrooms'] = property.no_of_bedroom;
        prop['bathrooms'] = property.no_of_bathroom;
        prop['balconies'] = property.no_of_balcony;
        prop['size'] = property.size + " sq. ft.";
        prop['price'] = property.final_price;
        prop['priceString'] = priceToStr(property.final_price);
        prop['category'] = property.category;
        prop['address'] = property.street_number + " " + property.street_name + ", " + property.city;
        prop['img'] = property.property_img1;
        toReturn['data'].push(prop);
    });
    return toReturn;
};

const getPropertyDetails = (property) => {
    const prop = {};
    prop['count'] = 1;
    prop['id'] = property.property_id;
    prop['name'] = property.property_name;
    prop['bedrooms'] = property.no_of_bedroom;
    prop['bathrooms'] = property.no_of_bathroom;
    prop['balconies'] = property.no_of_balcony;
    prop['size'] = property.size + " sq. ft.";
    prop['price'] = property.price;
    prop['priceString'] = priceToStr(property.price);
    prop['category'] = property.category;
    prop['address'] = property.street_number + " " + property.street_name + ", " + property.city;
    prop['streetNumber'] = property.street_number;
    prop['streetName'] = property.street_name;
    prop['city'] = property.city;
    prop['img'] = property.property_img1;
    prop['description'] = property.description;
    prop['leisure'] = property.leisure;
    prop['security'] = property.security;
    return prop;
};

const getSoldPropertyDetails = (property) => {
    const prop = {};
    prop['count'] = 1;
    prop['id'] = property.property_id;
    prop['name'] = property.property_name;
    prop['bedrooms'] = property.no_of_bedroom;
    prop['bathrooms'] = property.no_of_bathroom;
    prop['balconies'] = property.no_of_balcony;
    prop['size'] = property.size + " sq. ft.";
    prop['price'] = property.final_price;
    prop['priceString'] = priceToStr(property.final_price);
    prop['category'] = property.category;
    prop['address'] = property.street_number + " " + property.street_name + ", " + property.city;
    prop['img'] = property.property_img1;
    prop['description'] = property.description;
    prop['leisure'] = property.leisure;
    prop['security'] = property.security;
    prop['dateOfSale'] = formatDate(property.date_of_sale);
    prop['datePutOnSale'] = formatDate(property.date_put_on_sale);
    return prop;
};

const createProperty = (req) => {
    const property = {};
    property['name'] = req.body.propertyName;
    property['bedrooms'] = req.body.bedrooms;
    property['balconies'] = req.body.balconies;
    property['bathrooms'] = req.body.bathrooms;
    property['streetNumber'] = req.body.streetNumber;
    property['streetName'] = req.body.streetName;
    property['city'] = req.body.city;
    property['state'] = req.body.state;
    property['propertyImg'] = req.file.filename;
    property['size'] = req.body.size;
    property['leisures'] = req.body.leisures;
    property['security'] = req.body.security;
    property['description'] = req.body.description;
    property['zip'] = req.body.zip; 
    property['agentId'] = req.body.agentId;
    property['price'] = req.body.price;
    property['date'] = formatDate(Date.now());
    property['sellerId'] = req.body.sellerId;
    property['category'] = req.body.category;
    return property;
}

module.exports.getOnSaleProperty = getOnSaleProperty;
module.exports.getSoldProperty = getSoldProperty;
module.exports.getPropertyDetails = getPropertyDetails;
module.exports.getSoldPropertyDetails = getSoldPropertyDetails;
module.exports.createProperty = createProperty;