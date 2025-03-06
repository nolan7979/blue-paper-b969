/* eslint-disable @next/next/no-img-element */
import axios from 'axios';
import { GetStaticPaths, NextPage } from 'next';

import i18nConfig from '../../../../i18n.config';

import ManagerPage from '@/modules/football/manager/page';

import en from '~/lang/en';
import vi from '~/lang/vi';

export const getStaticPaths: GetStaticPaths = async () => {
  return { paths: [], fallback: true };
};

export const getStaticProps = async (context: any) => {
  const { params = {}, locale = vi } = context;
  const { managerParams = [] } = params;
  const managerId = managerParams[managerParams.length - 1];

  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/manager/${managerId}`;
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: url,
    headers: {},
  };

  const managerData = await axios
    .request(config)
    .then((response) => {
      return response.data.data || {};
    })
    .catch((error) => {
      return -1;
    });

  const urlCareerHistory = `${process.env.NEXT_PUBLIC_API_BASE_URL}/manager/${managerId}/career-history`;
  const configCareerHistory = {
    method: 'get',
    maxBodyLength: Infinity,
    url: urlCareerHistory,
    headers: {},
  };

  const careerHistories = await axios
    .request(configCareerHistory)
    .then((response) => {
      return response.data.data || [];
    })
    .catch((error) => {
      return [];
    });

  if (managerData === -1) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const manager = managerData.manager || {};

  return {
    props: {
      id: manager?.id,
      slug: manager?.slug,
      managerDetails: managerData,
      managerCareerHistory: careerHistories,
    },
    revalidate: 1800,
  };
};

interface Props {
  id: string;
  slug: string;
  managerDetails: any;
  managerCareerHistory: any;
}

const ManagerDetailedPage: NextPage<Props> = ({
  managerDetails,
  managerCareerHistory,
}: Props) => {
  const { manager = {} } = managerDetails || {};
  const { name } = manager || {};

  return (
    <ManagerPage
      name={name}
      manager={manager}
      managerCareerHistory={managerCareerHistory}
      managerDetails={managerDetails}
    />
  );
};

export default ManagerDetailedPage;
