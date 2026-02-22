import { useCallback, useMemo, useRef, useState } from 'react';

import { BurgerIngredientsList } from '@components/burger-ingredients-list/burger-ingredients-list.tsx';
import { IngredientModal } from '@components/modal/ingredient-modal/ingredient-modal.tsx';
import { Modal } from '@components/modal/modal.tsx';
import { Tabs } from '@components/tabs/tabs.tsx';
import { useGetIngredientsQuery } from '@services/ingredients';
import { TABS } from '@utils/constants.ts';
import { groupByIngredientsType } from '@utils/utils.ts';

import type { Ingredient } from '@/types/ingredient.ts';
import type { TabItem } from '@/types/tabs.ts';

import styles from './burger-ingredients.module.css';

export const BurgerIngredients = (): React.JSX.Element => {
  const { data: ingredients = [] } = useGetIngredientsQuery({});
  const tabs: TabItem[] = TABS;
  const [activeTab, setActiveTab] = useState(TABS[0].value);
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
  const listGroupRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const groupedIngredients = useMemo(
    () => groupByIngredientsType(ingredients),
    [ingredients]
  );

  const handleTabChange = (value: string): void => {
    setActiveTab(value);
    listGroupRefs.current[value]?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleOnCardClick = (item: Ingredient): void => {
    setSelectedIngredient(item);
  };

  const handleModalClose = (): void => {
    setSelectedIngredient(null);
  };

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    let closestType = TABS[0].value;
    let minDistance = Infinity;

    Object.keys(listGroupRefs.current).forEach((type) => {
      const section = listGroupRefs.current[type];
      if (section) {
        const rect = section.getBoundingClientRect();
        const distance = Math.abs(rect.top - containerRect.top);
        if (distance < minDistance) {
          minDistance = distance;
          closestType = type;
        }
      }
    });

    setActiveTab(closestType);
  }, []);

  const setListGroupRef = useCallback(
    (type: string): ((el: HTMLDivElement | null) => void) => {
      return (el: HTMLDivElement | null) => {
        listGroupRefs.current[type] = el;
      };
    },
    []
  );

  return (
    <section className={styles.burger_ingredients}>
      <Tabs tabs={tabs} onChange={handleTabChange} activeTab={activeTab} />

      <div
        ref={containerRef}
        onScroll={handleScroll}
        className={`${styles.ingredients_list} custom-scroll`}
      >
        {groupedIngredients.map((group, index) => (
          <BurgerIngredientsList
            key={index}
            ref={setListGroupRef(group.type)}
            type={group.type}
            ingredients={group.ingredients}
            onCardClick={handleOnCardClick}
          />
        ))}
      </div>

      {selectedIngredient && (
        <Modal
          title={'Детали ингредиента'}
          isOpen={!!selectedIngredient}
          onClose={handleModalClose}
        >
          <IngredientModal ingredient={selectedIngredient} />
        </Modal>
      )}
    </section>
  );
};
