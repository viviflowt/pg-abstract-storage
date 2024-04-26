import dataSource from './data-source'

const main = async () => {
  await dataSource.initialize()

  await dataSource.destroy()
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(() => {
    console.log('Done!')
    process.exit(0)
  })
