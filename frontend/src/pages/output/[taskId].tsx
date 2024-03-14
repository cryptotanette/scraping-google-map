import { GetServerSideProps } from 'next/types'
import Seo from '../../components/Seo'
import TaskComponent from '../../components/TaskComponent/TaskComponent'
import AuthedDashboard from '../../layouts/AuthedDashboard'
import Api from '../../utils/api'
import { create_title } from '../../utils/common'
import Links from '../../utils/data/links'

const Page = ({ taskId, scrapers, ...props }: any) => {
  const response = props.response
  const task = response.task
  const scraperConfig = scrapers.find(
    scraper => scraper.scraper_name === task.scraper_name
  )

  if (!scraperConfig) {
    return <div>No Scraper Config Found, Did you forgot to add Scraper?</div>
  }

  return (
    <>
      <Seo {...props} title={create_title(props, `Task ${taskId}`)} />
      <AuthedDashboard {...props}>
        <TaskComponent taskId={taskId} response={response} {...scraperConfig} />
      </AuthedDashboard>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({
  params,
  res,
  req,
}) => {
  try {
    const id = (params as any).taskId

    const { data } = await Api.getTaskResults(id)

    return {
      props: { response: data, taskId: id },
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return {
        redirect: { destination: Links.notFound, permanent: false },
      }
    } else {
      // Handle other errors
      throw error
    }
  }
}
export default Page
