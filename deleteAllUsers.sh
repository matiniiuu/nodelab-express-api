# deleteAllUsers.sh

aws cognito-idp list-users --user-pool-id us-west-2_6lDNuKl8I |
jq -r '.Users | .[] | .Username' |
while read user; do
  aws cognito-idp admin-delete-user --user-pool-id us-west-2_6lDNuKl8I --username $user
  echo "$user deleted"
done