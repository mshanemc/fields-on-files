sfdx force:org:create -f config/project-scratch-def.json -d 1 -s
sfdx force:source:push
sfdx force:user:permset:assign -n FieldsOnFilesPerms
sfdx automig:load -d data
sfdx force:org:open -p /lightning/o/Account/list?filterName=Recent