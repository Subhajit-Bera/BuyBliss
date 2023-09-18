class ApiFeatures {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

    //SEARCH FILTER -> use it in GET ALL PRODUCTS
    search() {
        const keyword = this.queryStr.keyword
            ? {
                name: {
                    $regex: this.queryStr.keyword, // $regex operator provides the functionality for pattern matching in the queries.
                    $options: "i", //for case case in-sensitive -> treat small & capital letter as same
                },
            }
            : {};

        this.query = this.query.find({ ...keyword });
        return this;
    }

    filter() {
        //In JavaScript objects are pass through reference so inorder to copy the queryStr we use spread operator
        const queryCopy = { ...this.queryStr };



        //  Need to remove fields in order to filter category ->because keywords are not needed 
        const removeFields = ["keyword", "page", "limit"];

        //Removing fields from queryCopy-> CATEGORY FILTER
        removeFields.forEach((key) => delete queryCopy[key]);
        //console.log(queryCopy)

        // FILTER FOR PRICE AND RATING:
        //queryCopy is a object so convert it into string
        let queryStr = JSON.stringify(queryCopy);
        //console.log(queryStr)
        
        //Using Regular Expression for adding operators for pricing filter
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);
       //console.log(queryStr)

       //Converting the string into object using JSON.parse()
        this.query = this.query.find(JSON.parse(queryStr));

        return this;
    }

    pagination(resultPerPage) {
        const currentPage = Number(this.queryStr.page) || 1;
    
        const skip = resultPerPage * (currentPage - 1);
    
        this.query = this.query.limit(resultPerPage).skip(skip);
    
        return this;
    }
}

module.exports = ApiFeatures;