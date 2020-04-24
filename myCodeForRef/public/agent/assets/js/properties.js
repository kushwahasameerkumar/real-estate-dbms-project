const state = {
    start: 1,
    end: 10
};

const propertyCard = (name, address, bedrooms, bathrooms, balconies, size, category, img, price = 1000) => {
    return `<div class="col-sm-12 col-md-4 col-lg-4" style="margin-bottom: 13px;">
                <div class="card" style="color: #535353;">
                    <img src="${img}" class="card-img-top" alt="${name}" style="height: 210px; width: 200%px"/>
                    <div class="property-type" style="position: absolute; top:5px; left: 5px;"><span class="badge badge-success">FOR ${category.toUpperCase()}</span></div>
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
                            <p style="font-size: 13px;"><i class="fas fa-chart-area"></i> ${size} sq. ft.</p>
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

fetch('http://localhost:5000/property')
    .then(res => res.json())
    .then(res => {
        const properties = res.data;
        console.log(properties);
        properties.forEach(property => {
            const prop = propertyCard(property.name, property.address, property.bedrooms, property.bathrooms, property.balconies, property.size, property.category, property.img);
            appendProperty(prop);
        });
    });

fetch('http://localhost:5000/property/utils/getLocation')
    .then(res => res.json())
    .then(res => appendLocationOptions(res));