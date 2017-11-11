import json
# import gensim
from gensim.models.keyedvectors import KeyedVectors

fname = '../../vocab.bin'
# model = gensim.models.Word2Vec.load(fname, binary=True)
word_vectors = KeyedVectors.load_word2vec_format(fname, binary=True)
# print dir(word_vectors)
# print word_vectors.word_vec('bread')

with open('../train.json') as f:
    data = json.load(f)

# print len(data)
# print data[0]

cuisines = {}
ingredients = {}

for dish in data:
    if dish['cuisine'] in cuisines:
        cuisines[dish['cuisine']] += 1
    else:
        cuisines[dish['cuisine']] = 1

    for ing in dish['ingredients']:
        if ing in ingredients:
            ingredients[ing] += 1
        else:
            ingredients[ing] = 1

print len(cuisines)
print len(ingredients)
print 1.0*len(ingredients)/len(cuisines)

not_found = []

for ing in ingredients:
    ings = ing.split()
    for ing2 in ings:
        try:
            word_vectors.word_vec(ing2)
        except:
            not_found.append(ing)
        # print ing
print len(not_found)
print not_found