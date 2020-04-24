const propertyCard = (name, address, bedrooms, bathrooms, balconies, size, category, img, priceString, id) => {
    return `<div class="col-sm-12 col-md-4 col-lg-4" style="margin-bottom: 13px; cursor:pointer" onclick="location.href='/property/${id}'">
                <div class="card" style="color: #535353;">
                    <img src="${img}" class="card-img-top" alt="${name}" style="height: 210px; width: 200%px"/>
                    <div class="property-type" style="position: absolute; top:5px; left: 5px;"><span class="badge badge-success">FOR ${category.toUpperCase()}</span></div>
                    <div class="property-price" style="position: absolute; bottom:5px; right: 5px;"><span class="badge badge-warning">₹${priceString}</span></div>
                    <div class="card-body">
                    <h5 style="font-size: 18px; font-weight: 600; color: blue;">${name}</h5>
                    <p style="font-size: 13px;"><i class="fas fa-map-marker-alt"></i> ${address}</p>
                    <div class="row">
                        <div class="col-sm-6 col-md-6 col-lg-6">
                            <p style="font-size: 13px;"><i class="fas fa-bed"></i> ${bedrooms} Bedrooms</p>
                        </div>
                        <div class="col-sm-6 col-md-6 col-lg-6">
                            <p style="font-size: 13px;"><i class="fas fa-bath"></i> ${bathrooms} Bathrooms</p>
                        </div>
                        <div class="col-sm-6 col-md-6 col-lg-6">
                            <p style="font-size: 13px;"><i class="fas fa-chart-area"></i> ${size}</p>
                        </div>
                        <div class="col-sm-6 col-md-6 col-lg-6">
                            <p style="font-size: 13px;"><i class="fas fa-hot-tub"></i> ${balconies} Balconies</p>
                        </div>
                    </div>
                    </div>
                </div>
            </div>`;
};

const propertySoldCard = (name, address, bedrooms, bathrooms, balconies, size, category, img, priceString, id) => {
    return `<div class="col-sm-12 col-md-4 col-lg-4" style="margin-bottom: 13px; cursor:pointer" onclick="location.href='/sold/${id}'">
                <div class="card" style="color: #535353;">
                    <img src="${img}" class="card-img-top" alt="${name}" style="height: 210px; width: 200%px"/>
                    <div class="property-type" style="position: absolute; top:5px; left: 5px;"><span class="badge badge-success">SOLD</span></div>
                    <div class="property-price" style="position: absolute; bottom:5px; right: 5px;"><span class="badge badge-warning">₹${priceString}</span></div>
                    <div class="card-body">
                    <h5 style="font-size: 18px; font-weight: 600; color: blue;">${name}</h5>
                    <p style="font-size: 13px;"><i class="fas fa-map-marker-alt"></i> ${address}</p>
                    <div class="row">
                        <div class="col-sm-6 col-md-6 col-lg-6">
                            <p style="font-size: 13px;"><i class="fas fa-bed"></i> ${bedrooms} Bedrooms</p>
                        </div>
                        <div class="col-sm-6 col-md-6 col-lg-6">
                            <p style="font-size: 13px;"><i class="fas fa-bath"></i> ${bathrooms} Bathrooms</p>
                        </div>
                        <div class="col-sm-6 col-md-6 col-lg-6">
                            <p style="font-size: 13px;"><i class="fas fa-chart-area"></i> ${size}</p>
                        </div>
                        <div class="col-sm-6 col-md-6 col-lg-6">
                            <p style="font-size: 13px;"><i class="fas fa-hot-tub"></i> ${balconies} Balconies</p>
                        </div>
                    </div>
                    </div>
                </div>
            </div>`;
};

function appendProperty(property){
    const propContainer = document.getElementById('propertiesContainer');
    propContainer.innerHTML += property;
}

function appendLocationOptions(locations){
    const inputLocation = document.getElementById('inputLocation');
    locations.forEach(location => {
        inputLocation.innerHTML += `<option>${location.street_name}</option>`;
    });
}

function appendParam(key, value, url){
    if(url.count>0)
        url.params += `&${key}=${value}`;
    else
        url.params += `${key}=${value}`;
    url.count++;
}

function extractNum(num){
    var txt = num;
    var numb = txt.match(/\d/g);
    numb = numb.join("");
    return numb;
}

function searchProperty(){
    const propContainer = document.getElementById('propertiesContainer');
    propContainer.innerHTML = '';
    let url = {
        params: '',
        count: 0
    }
    const category = document.getElementById('propCategory').value.toLowerCase();
    if(category!='property status'){    appendParam('category', category.split(' ')[1], url);}
    const location = document.getElementById('propLocation').value;
    if(location.toLowerCase()!='location'){    appendParam('location', location, url);}
    const bedrooms = document.getElementById('propBedrooms').value.toLowerCase();
    if(bedrooms!='bedrooms'){    appendParam('bedrooms', bedrooms, url);}
    const bathrooms = document.getElementById('propBathrooms').value.toLowerCase();
    if(bathrooms!='bathrooms'){    appendParam('bathrooms', bathrooms, url);}
    // const balcony = document.getElementById('propBalcony').value.toLowerCase();
    // if(balcony!='balcony')    appendParam('balcony', balcony, url);
    const size = document.getElementById('propSize').value.toLowerCase();
    if(size!='area from'){    appendParam('size', size, url);}
    const priceStart = extractNum(document.getElementById('slider-range-value1').innerHTML.toLowerCase());
    if(true){    appendParam('priceStart', priceStart, url);}
    const priceEnd = extractNum(document.getElementById('slider-range-value2').innerHTML.toLowerCase());
    if(true){    appendParam('priceEnd', priceEnd, url);}

    fetch('http://localhost:3000/api/property/search?'+url.params).then(res => res.json()).then(res => {
        const properties = res.data;
        properties.forEach(property => {
            const prop = propertyCard(property.name, property.address, property.bedrooms, property.bathrooms, property.balconies, property.size, property.category, property.img, property.priceString, property.id);
            appendProperty(prop);
        });
    });
}

function searchSoldProperty(){
    const propContainer = document.getElementById('propertiesContainer');
    propContainer.innerHTML = '';
    let url = {
        params: '',
        count: 0
    }
    const category = document.getElementById('propCategory').value.toLowerCase();
    if(category!='property status'){    appendParam('category', category.split(' ')[1], url);}
    const location = document.getElementById('propLocation').value;
    if(location.toLowerCase()!='location'){    appendParam('location', location, url);}
    const bedrooms = document.getElementById('propBedrooms').value.toLowerCase();
    if(bedrooms!='bedrooms'){    appendParam('bedrooms', bedrooms, url);}
    const bathrooms = document.getElementById('propBathrooms').value.toLowerCase();
    if(bathrooms!='bathrooms'){    appendParam('bathrooms', bathrooms, url);}
    // const balcony = document.getElementById('propBalcony').value.toLowerCase();
    // if(balcony!='balcony')    appendParam('balcony', balcony, url);
    const size = document.getElementById('propSize').value.toLowerCase();
    if(size!='area from'){    appendParam('size', size, url);}
    const priceStart = extractNum(document.getElementById('slider-range-value1').innerHTML.toLowerCase());
    if(true){    appendParam('priceStart', priceStart, url);}
    const priceEnd = extractNum(document.getElementById('slider-range-value2').innerHTML.toLowerCase());
    if(true){    appendParam('priceEnd', priceEnd, url);}

    fetch('http://localhost:3000/api/property/sold/search?'+url.params).then(res => res.json()).then(res => {
        const properties = res.data;
        properties.forEach(property => {
            const prop = propertySoldCard(property.name, property.address, property.bedrooms, property.bathrooms, property.balconies, property.size, property.category, property.img, property.priceString, property.id);
            appendProperty(prop);
        });
    });
}
// fetch('http://localhost:5000/property')
//     .then(res => res.json())
//     .then(res => {
//         const properties = res.data;
//         console.log(properties);
//         properties.forEach(property => {
//             const prop = propertyCard(property.name, property.address, property.bedrooms, property.bathrooms, property.balconies, property.size, property.category, property.img);
//             appendProperty(prop);
//         });
//     });

// fetch('http://localhost:5000/property/utils/getLocation')
//     .then(res => res.json())
//     .then(res => appendLocationOptions(res));
