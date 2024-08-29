curl -i http://localhost:3000/users

echo
echo
echo

curl \
  --silent \
  -i \
  -X POST \
  -d '{"name": "BJ", "age": "32", "email": "hi@hi.com"}' \
  http://localhost:3000/users

echo
echo
echo

curl \
  --silent \
  -i \
  -X POST \
  -d '{name": "BJ", "age": "32", "email": "hi@hi.com"}' \
  http://localhost:3000/users
