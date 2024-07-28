const cassandra = require('cassandra-driver');
require('dotenv').config();

const ServerError = require("../errors/server.error");

const client = new cassandra.Client({
    contactPoints: [process.env.CASSANDRA_CONTACT_POINTS],
    localDataCenter: process.env.CASSANDRA_LOCAL_DATA_CENTER,
    keyspace: process.env.CASSANDRA_KEYSPACE,
    authProvider: new cassandra.auth.PlainTextAuthProvider(process.env.CASSANDRA_USERNAME, process.env.CASSANDRA_PASSWORD),
});

/**
 * Class representing the Product Services.
 */
class ProductServices {
  /**
   * Retrieves all products.
   * @returns {Promise<Array>} The array of products.
   * @throws {ServerError} If there are no products to get or an error occurs.
   */
  async getAll() {
    try {
      const result = await client.execute("SELECT * FROM products;");

      if (result.rowLength > 0) {
        return result.rows;
      } else {
        throw new ServerError("There are no products to get.", 404);
      }
    } catch (error) {
      if (error instanceof ServerError) {
        throw error;
      }
      throw new ServerError("Error trying to get the products.", 500);
    }
  }

  /**
   * Retrieves a product by its ID.
   * @param {string} idProduct - The ID of the product.
   * @returns {Promise<Array>} The array containing the product.
   * @throws {ServerError} If the product is not found or an error occurs.
   */
  async getById(idProduct) {
    try {
      const result = await client.execute("SELECT * FROM products WHERE id_product = ?", [idProduct]);

      if (result.rowLength > 0) {
        return result.rows;
      } else {
        throw new ServerError("Product not found.", 404);
      }
    } catch (error) {
      if (error instanceof ServerError) {
        throw error;
      }
      throw new ServerError("Error trying to get the products.", 500);
    }
  }

  /**
   * Creates a new product.
   * @param {string} name - The name of the product.
   * @param {string} description - The description of the product.
   * @param {number} quantity - The quantity of the product.
   * @param {number} price - The price of the product.
   * @param {string} category - The category of the product.
   * @returns {Promise} The result of the product creation.
   * @throws {ServerError} If the product creation fails or an error occurs.
   */
  async createProduct(name, description, quantity, price, category) {
    try {
      const result = await client.execute(
        "INSERT INTO products (id_product, name, description, quantity, price, category) VALUES (uuid(), ?, ?, ?, ?, ?)",
        [name, description, quantity, price, category], { prepare: true }
      );

      if (result.info.queriedHost) {
        return result;
      } else {
        throw new ServerError("Guard failed.", 400);
      }
    } catch (error) {
      if (error instanceof ServerError) {
        throw error;
      }
      console.error(error);
      throw new ServerError("Error trying to create the product.", 500);
    }
  }

  /**
   * Updates a product.
   * @param {string} idProduct - The ID of the product to update.
   * @param {string} name - The updated name of the product.
   * @param {string} description - The updated description of the product.
   * @param {number} quantity - The updated quantity of the product.
   * @param {number} price - The updated price of the product.
   * @param {string} category - The updated category of the product.
   * @returns {Promise} The result of the product update.
   * @throws {ServerError} If the product is not found, the update fails, or an error occurs.
   */
  async updateProduct(idProduct, name, description, quantity, price, category) {
    try {
      const resultId = await client.execute("SELECT id_product FROM products WHERE id_product = ?", [idProduct]);

      if (resultId.rowLength == 0) {
        throw new ServerError("Product not found.", 404);
      }

      let updateQuery = "UPDATE products SET";
      const updateValues = [];

      if (name !== undefined) {
        updateQuery += " name = ?,";
        updateValues.push(name);
      }

      if (description !== undefined) {
        updateQuery += " description = ?,";
        updateValues.push(description);
      }

      if (quantity !== undefined) {
        updateQuery += " quantity = ?,";
        updateValues.push(quantity);
      }

      if (price !== undefined) {
        updateQuery += " price = ?,";
        updateValues.push(price);
      }

      if (category !== undefined) {
        updateQuery += " category = ?,";
        updateValues.push(category);
      }

      updateQuery = updateQuery.slice(0, -1);
      updateQuery += ` WHERE id_product = ?`;
      updateValues.push(idProduct);

      const result = await client.execute(updateQuery, updateValues, { prepare: true });

      if (result.info.queriedHost) {
        return result;
      } else {
        throw new ServerError("Guard failed.", 400);
      }
    } catch (error) {
      if (error instanceof ServerError) {
        throw error;
      }
      throw new ServerError("Error trying to update the product.", 500);
    }
  }

  /**
   * Deletes a product.
   * @param {string} idProduct - The ID of the product to delete.
   * @returns {Promise} The result of the product deletion.
   * @throws {ServerError} If the product is not found, the deletion fails, or an error occurs.
   */
  async deleteProduct(idProduct) {
    try {
      const resultId = await client.execute("SELECT id_product FROM products WHERE id_product = ?", [idProduct]);

      if (resultId.rowLength == 0) {
        throw new ServerError("Product not found.", 404);
      }

      const result = await client.execute("DELETE FROM products WHERE id_product = ?", [idProduct]);

      if (result.info.queriedHost) {
        return result;
      } else {
        throw new ServerError("Guard failed.", 400);
      }
    } catch (error) {
      console.error(error);
      throw new ServerError("Error trying to delete the product.", 500);
    }
  }
}
module.exports = new ProductServices();