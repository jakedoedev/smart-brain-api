const handleProfileGet = (req, res, db) => {
  const { id } = req.params;
  db.select('*').from('users').where({id})
    .then(user => {
      if (user.length) {
        res.json(user[0])
      } else {
        res.status(400).json('Not found')
      }
    })
    .catch(err => res.status(400).json('error getting user'))
}

const handleProfileUpdate = (req, res, db) => {
  // TODO: validation on params
  const { id } = req.params;
  const { name, age, pet} = req.body.formInput;
  db('users')
    .where({ id: id })
    .update({
      name: name,
      age: age,
      pet: pet
    })
    .then(response => {
      if(response){
        res.json('success');
      } else {
        res.status(400).json('Unable to update');
      }
    })
    .catch(error => response.status(400).json('Error updating user'));

}

module.exports = {
  handleProfileGet,
  handleProfileUpdate
}
