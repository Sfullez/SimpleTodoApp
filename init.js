configuration = {
	"_id": "todoapp-replica-set",
	"members": [
		{
			"_id": 0,
			"host": "mongo-primary:27017"
		},
		{
			"_id": 1,
			"host": "mongo-secondary:27017"
		}
	]
}

rs.initiate(configuration)