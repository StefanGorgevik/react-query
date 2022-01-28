import { toast } from '@chakra-ui/react';
import { useCustomToast } from 'components/app/hooks/useCustomToast';
import jsonpatch from 'fast-json-patch';
import { useMutation, UseMutateFunction, useQueryClient } from 'react-query';
import { queryKeys } from 'react-query/constants';
import type { User } from '../../../../../shared/types';
import { axiosInstance, getJWTHeader } from '../../../axiosInstance';
import { useUser } from './useUser';

// for when we need a server function
async function patchUserOnServer(
  newData: User | null,
  originalData: User | null,
 ): Promise<User | null> {
  if (!newData || !originalData) return null;
  // create a patch for the difference between newData and originalData
  const patch = jsonpatch.compare(originalData, newData);

  // send patched data to the server
  const { data } = await axiosInstance.patch(
    `/user/${originalData.id}`,
    { patch },
    {
      headers: getJWTHeader(originalData),
    },
  );
  return data.user;
 }


export function usePatchUser():UseMutateFunction<User, unknown, User, unknown> {
  const { user, updateUser } = useUser();
  const toast = useCustomToast();
  const queryClient = useQueryClient();
  const {mutate: patchUser} = useMutation(
    (newData: User) => patchUserOnServer(newData, user), 
    {
      onMutate: async (newData: User | null) => {
        //cancel any queries
        queryClient.cancelQueries(queryKeys.user);

        //snapshot of the prev user data
        const prevData: User = queryClient.getQueryData(queryKeys.user)
        //optimistically update the cache with new user values
        updateUser(newData);
        return {prevData};
      },
      onError: (error, newData, context) => {
        //roll back cache to saved value
        if(context.prevData) {
          updateUser(context.prevData);
          toast({
            title: "User not updated!",
            status: 'error'
          })
        }
      },
      onSuccess: (returnedUserData: User | null) => {
        if(!user) 
          toast({
            title: "User updated!",
            status: 'success'
          })
      },
      onSettled: () => {
        //invalidate user query to make sure we are up to sync
        queryClient.invalidateQueries(queryKeys.user)
      },
      }
  )

  return patchUser;
}
