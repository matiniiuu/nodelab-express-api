# Note
**Do not change the imports order in src/index.ts**	
# deploy
## staging
to deploy to staging run the following commands:
```git checkout staging```

```git merge staging develop```

```yarn build```

```git add . && git commit -m "build v x.x.x"```

```git push```


