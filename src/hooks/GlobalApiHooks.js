import { APIServices } from './fetchAPI';

export const fetchGroupChat = async ({ userData, storeGroupList = null, search = null, headers = {} }) => {
  const user = userData;

  let data = {
      "user_id": user?.id,
      "searchValue": search
  };

  try {
      const res = await APIServices.get({
          url: '/fetch-message-group',
          payload: data,
      });

      if ( res.status === 200 ) {

        storeGroupList(res?.data?.group_list);

      }
  } catch (error) {
      console.error("Error fetching group chat:", error);
      storeGroupList([]);
  }
};