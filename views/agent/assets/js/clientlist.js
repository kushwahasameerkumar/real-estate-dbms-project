const tableRow = (id,name,address,email, dob) => {
    return `<tr>
    <td><a href="/agentUser/client/${id}">${id}</a></td>
    <td>${name}</td>
    <td>${address}</td>
    <td>${email}</td>
    <td>${dob}</td>.
    <td><form action="/agentUser/deleteclient" method="POST"><input id="id" name= "id" style="display: none;" value="${id}"><button type="submit" id="delete">x</button></form></td>
</tr>`;
};

function appendRow(row){
    const rowContainer = document.getElementById('tableBody');
    rowContainer.innerHTML += row;
}

function searchClient(){
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
    const rowContainer = document.getElementById('tableBody');
    rowContainer.innerHTML = '';
            var name=document.getElementById('name').value;
            var address=document.getElementById('address').value;
            var id=document.getElementById('id').value;
        fetch('http://localhost:3000/api/profile/clientlist').then(res => { return res.json()}).then(data=>{
        const rows = data;
        if(name!=''||address!=''||id!=''){
             var count=0;
             rows.forEach(function(element) {
            
                    if(element.middle_name==null)
                     element.middle_name='';
                    var clientname=element.first_name+" "+element.middle_name+" "+element.last_name;
                    var clientaddress=element.street_number + " " +element.street_name+", "+element.city+", "+element.state+", PIN:- "+element.zip;
                    if((clientname.toLowerCase().includes(name.toLowerCase())&&name!='')||(clientaddress.toLowerCase().includes(address.toLowerCase())&&address!='')||element.client_id==id)
                    {   
                        const row = tableRow( element.client_id , clientname , clientaddress, element.email,formatDate(element.dob));
                        appendRow(row);
                        count++;
                    } 
                    
             });
            if(count==0)
            {
                const row = tableRow( "---","---","---","---","---","---");
                appendRow(row);
                
            }
        }else{
            rows.forEach(function(element){
                var clientname=element.first_name+" "+element.middle_name+" "+element.last_name;
                var clientaddress=element.street_number + " " +element.street_name+", "+element.city+", "+element.state+", PIN:- "+element.zip;
                const row = tableRow( element.client_id , clientname , clientaddress, element.email,formatDate(element.dob));
                appendRow(row);
            });
        }
    });
}
