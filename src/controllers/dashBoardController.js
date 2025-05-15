import dashboardService from "../services/dashBoardService.js";

const dashboardController = {

    getLowStock: async (req, res, next) => {
        try {
          const lowStock = await dashboardService.getLowStock(req.params);
      
          res.status(200).json({
            success: true,
            count: lowStock.length,
            data: lowStock
          });
        } catch (error) {
            error.message = error.error;
            console.log(error);
            error.statuscode = 500;
            next(error)
        }
      },

    getOutOfStock: async (req, res, next) => {
        try {
          const outOfStockItems = await dashboardService.getOutOfStock(req.params);
      
          res.status(200).json({
            success: true,
            count: outOfStockItems.length,
            data: outOfStockItems
          });
        } catch (error) {
            error.message = error.error;
            console.log(error);
            error.statuscode = 500;
            next(error)
        }
      }

}

export default dashboardController