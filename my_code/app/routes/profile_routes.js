const express= require('express');
const router=express.Router();
module.exports = function(db){
        router.get('/agent/:id',(req,res) =>{
            
            
            db.query('SELECT * from Agent where agent_id=? ',req.params.id,(err,details)=>{
                if (err) { 
                    console.log("error: ", err);
                    return;
                  }
                
                  if(details.length < 1){
                    return res.status(404).json({
                        count: 0
                    });
                } 
                console.log("Agent: ", details);
                res.status(200).json(details);
                   
            });

        });


        router.get('/agentsale/:id',(req,res) =>{
            db.query('SELECT Transaction_id,property_id,date_of_sale,final_price,seller_id,buyer_id,category from Agent,Transaction where Agent.agent_id=Transaction.agent_id  and Agent.agent_id=? ',req.params.id,(err,details)=>{
                if (err) { 
                    console.log("error: ", err);
                    return;
                  }
                  if(details.length < 1){
                    return res.status(404).json({
                        count: 0
                    });
                } 
                console.log("Agent Sale Details: ", details);
                res.status(200).json(details);
            });
        });


        router.get('/client/:id',(req,res) =>{
            db.query('SELECT * from Client where client_id='+req.params.id,(err,details)=>{
                if (err) { 
                    console.log("error: ", err);
                    return;
                  }
                
                  if(details.length < 1){
                    return res.status(404).json({
                        count: 0
                    });
                } 
                console.log("Client: ", details);
                res.status(200).json(details);
                   
            });
        });

        router.get('/clientsold/:id',(req,res) =>{
            db.query('SELECT * from Transaction,Property where  seller_id='+req.params.id+' and Property.property_id=Transaction.property_id and category="sale"',(err,details)=>{
                if (err) { 
                    console.log("error: ", err);
                    return;
                  }
                
                 
                console.log("ClientSold: ", details);
                res.status(200).json(details);
                   
            });
        });
        router.get('/clientbought/:id',(req,res) =>{
            db.query('SELECT * from Transaction,Property where  buyer_id='+req.params.id+' and Property.property_id=Transaction.property_id and category="sale"',(err,details)=>{
                if (err) { 
                    console.log("error: ", err);
                    return;
                  }
                
                  
                console.log("Clientbought: ", details);
                res.status(200).json(details);
                   
            });
        });
        router.get('/clientonrent/:id',(req,res) =>{
            db.query('SELECT * from Transaction,Property where  seller_id='+req.params.id+' and Property.property_id=Transaction.property_id and category="rent"',(err,details)=>{
                if (err) { 
                    console.log("error: ", err);
                    return;
                  }
                
                  
            
                console.log("Clientonrent: ", details);
                res.status(200).json(details);
                   
            });
        });
        router.get('/clienttenant/:id',(req,res) =>{
            db.query('SELECT * from Transaction,Property where  buyer_id='+req.params.id+' and Property.property_id=Transaction.property_id and category="rent"',(err,details)=>{
                if (err) { 
                    console.log("error: ", err);
                    return;
                  }
                
                  
                
                console.log("ClientTenant: ", details);
                res.status(200).json(details);
                   
            });
        });

        router.get('/clientonsale/:id',(req,res) =>{
            db.query('SELECT * from On_Sale where  seller_id='+req.params.id,(err,details)=>{
                if (err) { 
                    console.log("error: ", err);
                    return;
                  }
                
                  
                
                console.log("ClientOnSale: ", details);
                res.status(200).json(details);
                   
            });
        });
        
        router.get('/clientmobile/:id',(req,res) =>{
            db.query('SELECT * from Client_Phone_Detail where client_id='+req.params.id,(err,details)=>{
                if (err) { 
                    console.log("error: ", err);
                    return;
                  }
                
                  
                
                console.log("ClientMobile: ", details);
                res.status(200).json(details);
                   
            });
        });
        
        router.get('/agentmobile/:id',(req,res) =>{
            db.query('SELECT * from Agent_Phone_Detail where agent_id='+req.params.id,(err,details)=>{
                if (err) { 
                    console.log("error: ", err);
                    return;
                  }
                
                  
                
                console.log("AgentMobile: ", details);
                res.status(200).json(details);
                   
            });
        });
        
        return router;
};

