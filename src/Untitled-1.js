
//Q1.
   // -write an api which gives the missing number in an array of integers starting from 1….e.g [1,2,3,5,6,7] : 4 is missing
 // Your route code will look like this
 app.get("/sol1", function (req, res) {
    //logic : sum of numbers is n(n+1)/2..so get sum of all numbers in array. now take sum of numbers till last digit in the array
    let arr= [1,2,3,5,6,7]
   let lengthh=arr.length+1
   let sum=0
   for(let i=0;i<arr.length;i++){
       sum=sum+arr[i]
   }
   const consecitve=lengthh(lengthh+1)/2
   let missingnumber=consecitve-sum
   console.log(missingnumber)
    ///LOGIC WILL GO HERE 
    //res.send(  { data: missingNumber  }  );
//});
//Q2. 
// -write an api which gives the missing number in an array of integers starting from anywhere….e.g [33, 34, 35, 37, 38]: 36 is missing
// Your route code will look like this
//app.get("/sol2", function (req, res) {
        //logic : sum of n consecutive numbers is [ n * (first + last) / 2  ]..so get sum of all numbers in array. now take sum of n consecutive numbers.. n would be length+1 as 1 number is missing
        //let arr= [33, 34, 35, 37, 38]
        //let missingNumber
        ///LOGIC WILL GO HERE 
       // res.send(  { data: missingNumber  }  );
//});
//module.exports = app
// let sum1=0
// let arr1=[33,34,35,37,38]
// let num1=arr1.length-1
// let first=arr1[0]
// let last=arr1[arr1.length-1]
// for(let i=0;i<arr1.length;i++){
//     sum1=sum1+arr1[i]
// }
// const sss=(num1 * (first + last))/2
// let missingNumber1=sss-sum1
// console.log(missingNumber1)

// const arr = [33,34,35,37,38];
//     const total = []; 
//     //const arr = req.params.ar.obj;
//     let diff = arr[0] //33
//     const find = (arr) => {
//         for(let i=0; i< arr.length; i++){
 
//         // Check if difference and arr[i]-i
//         //both are equal or not
//             if(arr[i] - i != diff){
 
//         //Loop for consecutive
//         // missing elements
//                 while(diff < arr[i] - i){
//                     total.push(diff + i);
//                     diff += 1
//             }
//         }
//     }
//     return total;
//  }

//     const responce = find(arr)
//     res.send({data :responce })
