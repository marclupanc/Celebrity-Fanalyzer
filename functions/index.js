const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp()

const db = admin.firestore()

async function calculateTotalImpressions(advertiseDocRef) {
  const impressionsSnapshot = await advertiseDocRef.collection('impressions').get()
  let totalImpressions = 0

  impressionsSnapshot.forEach((doc) => {
    const data = doc.data()
    if (data && typeof data.impression === 'number') {
      totalImpressions += data.impression
    }
  })

  return totalImpressions
}

async function calculateTotalClicks(advertiseDocRef) {
  const clicksSnapshot = await advertiseDocRef.collection('clicks').get()
  let totalClicks = 0

  clicksSnapshot.forEach((doc) => {
    const data = doc.data()
    if (data && typeof data.clicked === 'number') {
      totalClicks += data.clicked
    }
  })

  return totalClicks
}

async function calculateTotalVisits(advertiseDocRef) {
  const visitorsSnapshot = await advertiseDocRef.collection('visitors').get()
  let totalVisits = 0

  visitorsSnapshot.forEach((doc) => {
    const data = doc.data()
    if (data && Array.isArray(data.visits)) {
      totalVisits += data.visits.length
    }
  })

  return totalVisits
}

async function updateAdvertiseStatus(docId) {
  const advertiseDocRef = db.collection('advertises').doc(docId)

  const docData = (await advertiseDocRef.get()).data()
  const myBudget = Number(docData.budget) ?? 0

  const totalImpressions = await calculateTotalImpressions(advertiseDocRef)
  const totalClicks = await calculateTotalClicks(advertiseDocRef)
  const totalVisits = await calculateTotalVisits(advertiseDocRef)

  const totalCost = totalImpressions / 100 + totalClicks / 20 + totalVisits / 20

  let newStatus = docData.status

  if (myBudget < totalCost) {
    newStatus = 'Inactive'
  }

  await advertiseDocRef.update({
    status: newStatus
  })

  console.log(`Document ${docId} updated with status: ${newStatus}`)
}

exports.onImpressionChange = functions.firestore
  .document('advertises/{docId}/impressions/{impressionId}')
  .onWrite(async (change, context) => {
    const docId = context.params.docId
    await updateAdvertiseStatus(docId)
  })

exports.onClickChange = functions.firestore.document('advertises/{docId}/clicks/{clickId}').onWrite(async (change, context) => {
  const docId = context.params.docId
  await updateAdvertiseStatus(docId)
})

exports.onVisitorChange = functions.firestore.document('advertises/{docId}/visitors/{visitorId}').onWrite(async (change, context) => {
  const docId = context.params.docId
  await updateAdvertiseStatus(docId)
})
