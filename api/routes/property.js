const express = require('express');
const router = express.Router();
const multer = require('multer');

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'uploads/');
	},
	filename: (req, file, cb) => {
		cb(null, Date.now() + file.originalname);
	}
})
const upload = multer({
	storage: storage
});

const utility = require('../utilities/property');
const commonUtils = require('../utilities/common');

var con = require('../../mysqlConfig.js');

router.get('/', (req, res) => {
	con.query('SELECT * FROM Property NATURAL JOIN On_Sale', (err, properties) => {
		if(err) 
			throw err;
		const response = utility.getOnSaleProperty(properties);
		res.status(200).json(response);
	});
});

//image url to be corrected, agentId & sellerId for property
router.post('/', upload.single('propertyImg'), (req, res) => {
	req.body.agentId = 2142;
	req.body.sellerId = 3661;
	const property = utility.createProperty(req);

	con.query('INSERT INTO `Property`(`property_name`, `street_number`, `street_name`, `city`, `state`, `zip`, `size`, `no_of_bedroom`, `no_of_bathroom`, `no_of_balcony`, `leisure`, `security`, `description`, `property_img1`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
		[property.name, property.streetNumber, property.streetName, property.city, property.state, property.zip, property.size, property.bedrooms, property.bathrooms, property.balconies, property.leisures, property.security, property.description, property.propertyImg],
		(err, createdProperty) => {
			if(err)
				throw err;
			con.query('INSERT INTO `On_Sale`(`property_id`, `agent_id`, `seller_id`, `price`, `category`, `date`) VALUES (?, ?, ?, ?, ?, ?)',
				[createdProperty.insertId, property.agentId, property.sellerId, property.price, property.category, property.date],
				(error, created) => {
					if(error)
						throw error;
					if(createdProperty.affectedRows == 1 && created.affectedRows == 1){
						return res.status(200).json({
							count: 1,
							success: true,
							saleId: created.insertId
						});
					}else{
						return res.status(500).json({
							count: 0,
							success: false
						});
					}
				}
			)
		}
	)
});

router.get('/sold', (req, res) => {
	con.query('SELECT * FROM Property NATURAL JOIN Transaction', (err, properties) => {
		if(err) 
			throw err;
		const response = utility.getSoldProperty(properties);
		res.status(200).json(response);
	});
});

router.get('/:id', (req, res) => {
	const id = req.params.id;
	con.query('SELECT * FROM Property NATURAL JOIN On_Sale WHERE property_id = ?', [id], (err, property) => {
		if(err) 
			throw err;
		if(property.length < 1){
			return res.status(404).json({
				count: 0
			});
		}
		const response = utility.getPropertyDetails(property[0]);
		res.status(200).json(response);
	});
});

router.post('/:id', (req, res) => {
	con.query('select * from On_Sale where property_id = ?', [req.params.id], (err, prop) => {
		if(err) 
			throw err;
		if(prop.length > 0){
			prop = prop[0];
			con.query('INSERT INTO `Transaction`(`buyer_id`, `seller_id`, `agent_id`, `property_id`, `final_price`, `date_of_sale`, `category`, `date_put_on_sale`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
				[req.body.buyerId, prop.seller_id, prop.agent_id, prop.property_id, req.body.finalPrice, commonUtils.formatDate(Date.now()), prop.category, prop.date],
				(error, response) => {
					if(error)
						throw error;
					if(response.affectedRows == 1){
						con.query('DELETE FROM On_Sale WHERE property_id = ?', [req.params.id], (err1, row) => {
							if(err1)
								throw err1;
							if(row.affectedRows ==1 ){
								return res.status(200).json({
									count:1,
									success: true,
									transactionId: response.insertId
								});
							}else{
								return res.status(404).json({
									count:0,
									success: false
								});
							}
						});
					}else{
						return res.status(404).json({
							count:0,
							success: false
						});
					}
				}
			);
		}else{
			return res.status(404).json({
				count:0,
				success: false
			});
		}
	})
});

router.get('/sold/:id', (req, res) => {
	const id = req.params.id;
	con.query('SELECT * FROM Property NATURAL JOIN Transaction WHERE property_id = ?', [id], (err, property) => {
		if(err) 
			throw err;
		if(property.length < 1){
			return res.status(404).json({
				count: 0
			});
		}
		const response = utility.getSoldPropertyDetails(property[0]);
		res.status(200).json(response);
	});
});

module.exports = router;
