import CategoryModel from "../models/retailModel/categoryModel.js";
import customerModel from "../models/retailModel/customerModel.js";
import invoiceModel from "../models/retailModel/invoiceModel.js";
import productModel from "../models/retailModel/productModel.js";

const billService = {
  calculateInvoiceItems: async (items, productModelInstance) => {
   const round2 = (num) => parseFloat(num.toFixed(2)); 

  try {
    let totalAmount = 0;
    let totalDiscount = 0;
    let totalGST = 0;

    const processedItems = await Promise.all(
      items.map(async (item) => {
        const product = await productModelInstance.findById(item.product_id);
        if (!product) {
          throw new Error(`Product not found: ${item.product_id}`);
        }

        const price = product.sale_price || product.price || 0;
        const discount = product.discount || 0;
        const quantity = item.quantity;

        const total = round2(price * quantity);
        const discountAmount = round2((discount / 100) * total);
        const gstRate = product.gst || 0;
        const gstAmount = round2((gstRate / 100) * (total - discountAmount));

        totalAmount += total;
        totalDiscount += discountAmount;
        totalGST += gstAmount;

        return {
          product_id: product._id,
          product_name: product.prod_name,
          quantity,
          price: round2(price),
          discount,
          total: round2(total - discountAmount),
          gst_rate: gstRate,
          gst_amount: gstAmount,
        };
      })
    );

    return {
      processedItems,
      totalAmount: round2(totalAmount),
      totalDiscount: round2(totalDiscount),
      totalGST: round2(totalGST),
      finalAmount: round2(totalAmount - totalDiscount + totalGST),
    };
  } catch (error) {
    console.error("Error in calculation:", error);
    throw {
      status: error.status || 500,
      message: error.message || "Internal Server Error",
    };
  }
  },

  invoice: async (data) => {
    const { retailOrg_id, store_id, user_id, customer_name, phoneNo, items } =
      data;

    try {
      if (!items || !Array.isArray(items)) {
        throw new Error("Items are required and must be an array.");
      }

      const productModelInstance = productModel();
      const customerModelInstance = customerModel();
      const invoiceInstance = invoiceModel();

      const lastInvoice = await invoiceInstance.findOne(
        { store_id }, 
        {},
        { sort: { created_at: -1 } } 
      );

      let nextNumber = 1;
      if (lastInvoice && lastInvoice.invoice_number) {
        const match = lastInvoice.invoice_number.match(/INV-(\d+)/);
        if (match) nextNumber = parseInt(match[1], 10) + 1;
      }
      const invoice_number = `INV-${String(nextNumber).padStart(5, "0")}`;

      const {
        processedItems,
        totalAmount,
        totalDiscount,
        totalGST,
        finalAmount,
      } = await billService.calculateInvoiceItems(items, productModelInstance);

      const invoiceData = {
        invoice_number,
        retailOrg_id,
        store_id,
        created_by: user_id,
        customer_id: null,
        items: processedItems,
        total_amount: totalAmount,
        discount_total: totalDiscount,
        gst_total: totalGST,
        final_amount: finalAmount,
      };

      const newInvoice = await invoiceInstance.create(invoiceData);

      let customer = await customerModelInstance.findOne({ phoneNo });
      if (!customer) {
        const newCustomerData = {
          customer_name,
          phoneNo,
          retailOrg_id,
          store_id,
          created_by: user_id,
        };
        customer = await customerModelInstance.create(newCustomerData);
      }

      const updatedInvoice = await invoiceInstance.findByIdAndUpdate(
        newInvoice._id,
        { customer_id: customer._id },
        { new: true }
      );

      return { updatedInvoice, customer };
    } catch (error) {
      console.error("Error in generating invoice:", error);
      throw {
        status: error.status || 500,
        message: error.message || "Internal Server Error",
      };
    }
  },

  /* invoice: async (data) => {
  const {
    invoice_number,
    retailOrg_id,
    store_id,
    user_id,
    customer_name,
    phoneNo,
    items,
  } = data;

  try {
    if (!items || !Array.isArray(items)) {
      throw new Error("Items are required and must be an array.");
    }

    const productModelInstance = productModel();
    const customerModelInstance = customerModel();
    const invoiceInstance = invoiceModel();

    let totalAmount = 0;
    let totalDiscount = 0;
    let totalGST = 0;

    const processedItems = await Promise.all(
      items.map(async (item) => {
        const product = await productModelInstance.findById(item.product_id);
        if (!product) {
          throw new Error(`Product not found: ${item.product_id}`);
        }

        const price = product.sale_price || product.price || 0;
        const discount = product.discount || 0;
        const quantity = item.quantity;

        const total = price * quantity;
        const discountAmount = (discount / 100) * total;

        // Use product.gst here instead of category gst_rate
        const gstRate = product.gst || 0;
        const gstAmount = (gstRate / 100) * (total - discountAmount);

        totalAmount += total;
        totalDiscount += discountAmount;
        totalGST += gstAmount;

        return {
          product_id: product._id,
          product_name: product.prod_name,
          quantity,
          price,
          discount,
          total: total - discountAmount,
          gst_rate: gstRate,
          gst_amount: gstAmount,
        };
      })
    );

    const invoiceData = {
      invoice_number,
      retailOrg_id,
      store_id,
      created_by: user_id,
      customer_id: null,
      items: processedItems,
      total_amount: totalAmount,
      discount_total: totalDiscount,
      gst_total: totalGST,
      final_amount: totalAmount - totalDiscount + totalGST,
    };

    const newInvoice = await invoiceInstance.create(invoiceData);

    let customer = await customerModelInstance.findOne({ phoneNo });

    if (!customer) {
      const newCustomerData = {
        customer_name,
        phoneNo,
        retailOrg_id,
        store_id,
        created_by: user_id,
      };
      customer = await customerModelInstance.create(newCustomerData);
    }

    const updatedInvoice = await invoiceInstance.findByIdAndUpdate(
      newInvoice._id,
      { customer_id: customer._id },
      { new: true }
    );

    return { updatedInvoice, customer };
  } catch (error) {
    console.error("Error in generating invoice:", error);
    throw {
      status: error.status || 500,
      message: error.message || "Internal Server Error",
    };
  }
}, */

  //   invoice: async (data) => {
  //     const {
  //       invoice_number,
  //       retailOrg_id,
  //       store_id,
  //       user_id,
  //       customer_name,
  //       phoneNo,
  //       items,
  //     } = data;
  //     try {
  //       if (!items || !Array.isArray(items)) {
  //         throw new Error("Items are required and must be an array.");
  //       }

  //       const productModelInstance = productModel();
  //       const categoryModelInstance = CategoryModel();
  //       const customerModelInstance = customerModel();

  //       let totalAmount = 0;
  //       let totalDiscount = 0;
  //       let totalGST = 0;

  //       // Process each item in the cart
  //       const processedItems = await Promise.all(
  //         items.map(async (item) => {
  //           const product = await productModelInstance.findById(item.product_id);
  //           if (!product)
  //             throw new Error(`Product not found: ${item.product_id}`);

  //           const category = await categoryModelInstance.findById(
  //             product.category_id
  //           );
  //           if (!category)
  //             throw new Error(`Category not found: ${product.category_id}`);

  //           const price = product.sale_price || product.price || 0;
  //           const discount = product.discount || 0;
  //           const quantity = item.quantity;
  //           const total = price * quantity;
  //           const discountAmount = (discount / 100) * total;

  //           const gstRate = category.gst_rate || 0;
  //           const gstAmount = (gstRate / 100) * (total - discountAmount);

  //           totalAmount += total;
  //           totalDiscount += discountAmount;
  //           totalGST += gstAmount;

  //           return {
  //             product_id: product._id,
  //             product_name: product.prod_name,
  //             quantity,
  //             price,
  //             discount,
  //             total: total - discountAmount,
  //             gst_rate: gstRate,
  //             gst_amount: gstAmount,
  //           };
  //         })
  //       );

  //       // Invoice Data Structure
  //       const invoiceData = {
  //         invoice_number,
  //         retailOrg_id,
  //         store_id,
  //         created_by: user_id,
  //         customer_id: null, // Initially set as null, will update after customer creation
  //         items: processedItems,
  //         total_amount: totalAmount,
  //         discount_total: totalDiscount,
  //         gst_total: totalGST,
  //         final_amount: totalAmount - totalDiscount + totalGST,
  //       };

  //       const invoiceInstance = invoiceModel();
  //       const newInvoice = await invoiceInstance.create(invoiceData);

  //       let customer = await customerModelInstance.findOne({ phoneNo });

  //       if (!customer) {
  //         const newCustomerData = {
  //           customer_name,
  //           phoneNo,
  //           retailOrg_id,
  //           store_id,
  //           created_by: user_id,
  //         };
  //         customer = await customerModelInstance.create(newCustomerData);
  //       }
  // d
  //       const updatedInvoice = await invoiceModel().findByIdAndUpdate(
  //         newInvoice._id,
  //         { customer_id: customer._id },
  //         { new: true }
  //       );

  //       return { updatedInvoice, customer };

  //       /*  const productModelInstance = productModel();
  //   const categoryModelInstance = CategoryModel();
  //   const customerModelInstance = customerModel();

  //       let totalAmount = 0;
  //       let totalDiscount = 0;
  //       let totalGST = 0;

  //       const processedItems = await Promise.all(items.map(async (item) => {
  //         const product = await productModelInstance.findById(item.product_id);
  //         if (!product) throw new Error(`Product not found: ${item.product_id}`);

  //         const category = await categoryModelInstance.findById(product.category_id);
  //         if (!category) throw new Error(`Category not found: ${product.category_id}`);

  //         const price = product.sale_price || product.price || 0;
  //         const discount = product.discount || 0;
  //         const quantity = item.quantity;
  //         const total = price * quantity;
  //         const discountAmount = (discount / 100) * total;

  //         const gstRate = category.gst_rate || 0;
  //         const gstAmount = (gstRate / 100) * (total - discountAmount);

  //         totalAmount += total;
  //         totalDiscount += discountAmount;
  //         totalGST += gstAmount;

  //         return {
  //           product_id: product._id,
  //           product_name: product.prod_name,
  //           quantity,
  //           price,
  //           discount,
  //           total: total - discountAmount,
  //           gst_rate: gstRate,
  //           gst_amount: gstAmount
  //         };
  //       }));
  //       const invoiceData = {
  //         invoice_number,
  //         retailOrg_id,
  //         store_id,
  //         created_by: user_id,
  //         customer_name,
  //         phoneNo,
  //         items: processedItems,
  //         total_amount: totalAmount,
  //         discount_total: totalDiscount,
  //         gst_total: totalGST,
  //         final_amount: totalAmount - totalDiscount + totalGST
  //       };

  //       const invoiceInstance = invoiceModel();
  //       const newInvoice = await invoiceInstance.create(invoiceData);

  //       let customer = await customerModelInstance.findOne({ phoneNo });

  //       if (!customer) {
  //         const newCustomerData = {
  //           customer_name,
  //           phoneNo,
  //           retailOrg_id,
  //           store_id,
  //           created_by: user_id,
  //           invoice_id: newInvoice._id,
  //         };
  //         customer = await customerModelInstance.create(newCustomerData);
  //       } else {
  //         customer = await customerModelInstance.findOneAndUpdate(
  //           { phoneNo: phoneNo },
  //           { invoice_id: newInvoice._id },
  //           { new: true }
  //         );
  //       }

  //        return { newInvoice, customer }; */

  //       /* const productModelInstance = productModel();
  //       const categoryModelInstance = CategoryModel();
  //       const invoiceInstance = invoiceModel();

  //       let totalAmount = 0;
  //       let totalDiscount = 0;
  //       let totalGST = 0;

  //       const processedItems = await Promise.all(
  //         items.map(async (item) => {
  //           const product = await productModelInstance.findById(item.product_id);
  //           if (!product)
  //             throw new Error(`Product not found: ${item.product_id}`);

  //           const category = await categoryModelInstance.findById(
  //             product.category_id
  //           );
  //           if (!category)
  //             throw new Error(`Category not found: ${product.category_id}`);

  //           const price = product.sale_price || product.price || 0;
  //           const discount = product.discount || 0;
  //           const quantity = item.quantity;
  //           const total = price * quantity;
  //           const discountAmount = (discount / 100) * total;
  //           const gstRate = category.gst_rate || 0;
  //           const gstAmount = (gstRate / 100) * (total - discountAmount);

  //           totalAmount += total;
  //           totalDiscount += discountAmount;
  //           totalGST += gstAmount;

  //           return {
  //             product_id: product._id,
  //             product_name: product.prod_name,
  //             quantity,
  //             price,
  //             discount,
  //             total: total - discountAmount,
  //             gst_rate: gstRate,
  //             gst_amount: gstAmount,
  //           };
  //         })
  //       );

  //       const finalInvoice = {
  //         invoice_number,
  //         retailOrg_id,
  //         store_id,
  //         created_by:user_id,
  //         customer_name,
  //         phoneNo,
  //         items: processedItems,
  //         total_amount: totalAmount,
  //         discount_total: totalDiscount,
  //         gst_total: totalGST,
  //         final_amount: totalAmount - totalDiscount + totalGST,
  //       };

  //       const createdInvoice = await invoiceInstance.create(finalInvoice);
  //       return createdInvoice; */
  //     } catch (error) {
  //       console.error("Error in add customer:", error);
  //       throw {
  //         status: error.status || 500,
  //         message: error.message || "Internal Server Error",
  //       };
  //     }
  //   },
};

export default billService;
