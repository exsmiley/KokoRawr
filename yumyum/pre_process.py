import json
import io


def get_counts(data):
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

    # ing_list = sorted([(count, ing) for (ing, count) in ingredients.iteritems()])
    return cuisines, ingredients

def make_sentences(data):
    f = io.open('../data/sentences.txt', 'w', encoding='utf8')
    for dish in data:
        ings = map(lambda x: x.split(), dish['ingredients'])
        s = ' '.join(dish['ingredients'])
        f.write(s + '\n')
    f.close()


def gen_ingredients(data):
    _, ings = get_counts(data)
    f = io.open('../data/ingredients.txt', 'w', encoding='utf8')
    for ing in ings:
        f.write(ing + '\n')
    f.close()






if __name__ == '__main__':
    with open('../data/train.json') as f:
        data = json.load(f)

    make_sentences(data)

