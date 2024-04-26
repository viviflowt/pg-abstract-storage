import dataSource from './data-source'

const main = async () => {
  await dataSource.initialize()
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await dataSource.destroy()
    process.exit(0)
  })
