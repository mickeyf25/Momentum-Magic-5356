import React from 'react';
import { motion } from 'framer-motion';
import ReactECharts from 'echarts-for-react';
import { useTask } from '../context/TaskContext';
import { format, startOfWeek, endOfWeek, subWeeks } from 'date-fns';

const Analytics = () => {
  const { tasks, getTasksByCategory } = useTask();
  const tasksByCategory = getTasksByCategory();

  // Task completion chart data
  const getTaskCompletionData = () => {
    const completed = tasks.filter(task => task.completed).length;
    const pending = tasks.filter(task => !task.completed).length;

    return {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        textStyle: { color: '#6b7280' }
      },
      series: [
        {
          name: 'Task Status',
          type: 'pie',
          radius: '50%',
          data: [
            { value: completed, name: 'Completed', itemStyle: { color: '#10b981' } },
            { value: pending, name: 'Pending', itemStyle: { color: '#a855f7' } }
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
  };

  // Category distribution data
  const getCategoryData = () => {
    const categoryData = Object.entries(tasksByCategory)
      .filter(([category, tasks]) => tasks.length > 0)
      .map(([category, tasks]) => ({
        category,
        total: tasks.length,
        completed: tasks.filter(task => task.completed).length
      }));

    const colors = ['#a855f7', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' }
      },
      legend: {
        data: ['Total', 'Completed'],
        textStyle: { color: '#6b7280' }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: categoryData.map(item => item.category),
        axisLine: { lineStyle: { color: '#6b7280' } }
      },
      yAxis: {
        type: 'value',
        axisLine: { lineStyle: { color: '#6b7280' } }
      },
      series: [
        {
          name: 'Total',
          type: 'bar',
          data: categoryData.map((item, index) => ({
            value: item.total,
            itemStyle: { color: colors[index % colors.length] }
          })),
          barWidth: '40%'
        },
        {
          name: 'Completed',
          type: 'bar',
          data: categoryData.map((item, index) => ({
            value: item.completed,
            itemStyle: { color: colors[index % colors.length], opacity: 0.7 }
          })),
          barWidth: '40%'
        }
      ]
    };
  };

  // Priority distribution data
  const getPriorityData = () => {
    const priorities = tasks.reduce((acc, task) => {
      acc[task.priority] = (acc[task.priority] || 0) + 1;
      return acc;
    }, {});

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: ['High', 'Medium', 'Low'],
        axisLine: { lineStyle: { color: '#6b7280' } }
      },
      yAxis: {
        type: 'value',
        axisLine: { lineStyle: { color: '#6b7280' } }
      },
      series: [
        {
          name: 'Tasks',
          type: 'bar',
          data: [
            { value: priorities.high || 0, itemStyle: { color: '#ef4444' } },
            { value: priorities.medium || 0, itemStyle: { color: '#f59e0b' } },
            { value: priorities.low || 0, itemStyle: { color: '#10b981' } }
          ],
          barWidth: '60%'
        }
      ]
    };
  };

  // Weekly progress data
  const getWeeklyProgressData = () => {
    const weeks = [];
    const completedData = [];
    const createdData = [];

    for (let i = 3; i >= 0; i--) {
      const weekStart = startOfWeek(subWeeks(new Date(), i));
      const weekEnd = endOfWeek(weekStart);
      weeks.push(format(weekStart, 'MMM dd'));

      const weekTasks = tasks.filter(task => {
        const taskDate = new Date(task.createdAt);
        return taskDate >= weekStart && taskDate <= weekEnd;
      });

      const weekCompleted = weekTasks.filter(task => task.completed).length;
      createdData.push(weekTasks.length);
      completedData.push(weekCompleted);
    }

    return {
      tooltip: { trigger: 'axis' },
      legend: {
        data: ['Created', 'Completed'],
        textStyle: { color: '#6b7280' }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: weeks,
        axisLine: { lineStyle: { color: '#6b7280' } }
      },
      yAxis: {
        type: 'value',
        axisLine: { lineStyle: { color: '#6b7280' } }
      },
      series: [
        {
          name: 'Created',
          type: 'line',
          data: createdData,
          itemStyle: { color: '#a855f7' },
          areaStyle: { opacity: 0.3 }
        },
        {
          name: 'Completed',
          type: 'line',
          data: completedData,
          itemStyle: { color: '#10b981' },
          areaStyle: { opacity: 0.3 }
        }
      ]
    };
  };

  const stats = {
    total: tasks.length,
    completed: tasks.filter(task => task.completed).length,
    completionRate: tasks.length > 0 ? Math.round((tasks.filter(task => task.completed).length / tasks.length) * 100) : 0,
    overdue: tasks.filter(task =>
      !task.completed && task.dueDate && new Date(task.dueDate) < new Date()
    ).length,
    categories: Object.keys(tasksByCategory).filter(category => tasksByCategory[category].length > 0).length
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Analytics
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Track your momentum and productivity insights across categories
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
            {stats.total}
          </div>
          <div className="text-gray-600 dark:text-gray-400 text-sm mt-1">
            Total Tasks
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="text-3xl font-bold text-green-600 dark:text-green-400">
            {stats.completed}
          </div>
          <div className="text-gray-600 dark:text-gray-400 text-sm mt-1">
            Completed
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="text-3xl font-bold text-pink-600 dark:text-pink-400">
            {stats.completionRate}%
          </div>
          <div className="text-gray-600 dark:text-gray-400 text-sm mt-1">
            Completion Rate
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="text-3xl font-bold text-red-600 dark:text-red-400">
            {stats.overdue}
          </div>
          <div className="text-gray-600 dark:text-gray-400 text-sm mt-1">
            Overdue
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {stats.categories}
          </div>
          <div className="text-gray-600 dark:text-gray-400 text-sm mt-1">
            Categories
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Task Completion Status
          </h3>
          <ReactECharts option={getTaskCompletionData()} style={{ height: '300px' }} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Priority Distribution
          </h3>
          <ReactECharts option={getPriorityData()} style={{ height: '300px' }} />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Tasks by Category
        </h3>
        <ReactECharts option={getCategoryData()} style={{ height: '400px' }} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Weekly Progress
        </h3>
        <ReactECharts option={getWeeklyProgressData()} style={{ height: '400px' }} />
      </motion.div>
    </motion.div>
  );
};

export default Analytics;