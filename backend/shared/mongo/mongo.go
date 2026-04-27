package mongo

import (
	"context"
	"errors"
	"time"

	mongodrv "go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

// Config holds minimal connection configuration.
type MongoConfig struct {
	URI         string
	DBName      string
	ConnTimeout time.Duration // default 30s if zero
}

// Connect opens a MongoDB connection, verifies it with Ping, and returns
// the client, a database handle, and a cleanup function you should call on shutdown.
func ConnectMongoDB(parentCtx context.Context, cfg MongoConfig) (*mongodrv.Client, *mongodrv.Database, func(context.Context) error, error) {
	if cfg.URI == "" {
		return nil, nil, nil, errors.New("mongo: Config.URI is empty")
	}
	if cfg.DBName == "" {
		return nil, nil, nil, errors.New("mongo: Config.DBName is empty")
	}
	if cfg.ConnTimeout == 0 {
		cfg.ConnTimeout = 30 * time.Second
	}

	// ApplyURI config; Atlas recommends pinning Server API v1 for stability.
	serverAPI := options.ServerAPI(options.ServerAPIVersion1)
	myOptions := options.Client().ApplyURI(cfg.URI).SetServerAPIOptions(serverAPI)

	// Time-bound connect + ping
	ctx, cancel := context.WithTimeout(parentCtx, cfg.ConnTimeout)
	defer cancel()

	// Connect and Ping
	client, err := mongodrv.Connect(myOptions)
	if err != nil {
		return nil, nil, nil, err
	}
	if err := client.Ping(ctx, nil); err != nil {
		_ = client.Disconnect(context.Background())
		return nil, nil, nil, err
	}
	// Creates a handle to the database
	db := client.Database(cfg.DBName)

	// Cleanup function to close the connection
	closeFn := func(ctx context.Context) error {
		return client.Disconnect(ctx)
	}

	// returns the client, database handle, and cleanup function, error
	return client, db, closeFn, nil
}
