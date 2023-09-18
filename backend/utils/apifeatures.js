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

        console.log(queryCopy);

        //  Need to remove fields in order to filter category ->because keywords are not needed 
        const removeFields = ["keyword", "page", "limit"];

        //Removing fields from queryCopy
        removeFields.forEach((key) => delete queryCopy[key]);
        console.log(queryCopy);

        this.query=this.query.find(queryCopy);

        return this;
    }
}

module.exports = ApiFeatures;