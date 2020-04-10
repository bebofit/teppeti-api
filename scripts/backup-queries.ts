// THIS QUERY IS FOR GROUPING BY DATE
// const res = await this.model.aggregate([
//   {
//     $match: {
//       branch,
//       date: { $gte: start, $lte: end }
//     }
//   },
//   {
//     $group: {
//       _id: {
//         $add: [
//           { $dayOfYear: '$date' },
//           { $multiply: [400, { $year: '$date' }] }
//         ]
//       },
//       // branch: { $first: '$branch' },
//       // soldItems: { $sum: 1 },
//       // first: { $min: '$date' },
//       sales: { $sum: '$price' }
//     }
//   },
//   { $sort: { _id: 1 } },
//   {
//     $project: {
//       //     // yearMonthDayUTC: {
//       //     //   $dateToString: { format: '%d-%m-%Y', date: '$first' }
//       //     // },
//       //     // date: '$first',
//       sales: 1,
//       _id: 0
//     }
//   }
// ]);
// return res.map(s => s.sales);
