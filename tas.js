// Method decorator to log the execution time of a function
function logExecutionTime(target, key, descriptor) {
    const originalMethod = descriptor.value;
  
    descriptor.value = function () {
      const start = performance.now();  // Start timing
      const result = originalMethod.apply(this, arguments);  // Call the original method
      const executionTime = performance.now() - start;  // Calculate execution time
      console.log(`Method ${key} executed in: ${executionTime}ms`);  // Log execution time
      return result;  // Return the result of the original method
    };
  
    return descriptor;  // Return the modified method descriptor
  }
  
  class TestClass {
    @logExecutionTime
    myMethod() {
      // Simulate work
      for (let i = 0; i < 10000000; i++) { }
    }
  }
  
  const instance = new TestClass();
  instance.myMethod();  // Logs the execution time of 'myMethod'